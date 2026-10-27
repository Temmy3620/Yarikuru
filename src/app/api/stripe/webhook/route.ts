import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function POST(req: Request) {
	const body = await req.text();
	const headersList = await headers();
	const signature = headersList.get("stripe-signature");

	if (!signature) {
		return NextResponse.json(
			{ error: "Stripe-signatureヘッダーがありません。" },
			{ status: 400 },
		);
	}

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET!,
		);
	} catch (err) {
		console.error("Webhook署名の検証に失敗しました:", err);
		return NextResponse.json(
			{ error: "Webhook署名の検証に失敗しました。" },
			{ status: 400 },
		);
	}

	const supabaseAdmin = createServiceRoleClient();

	try {
		switch (event.type) {
			case "checkout.session.completed": {
				const session = event.data.object as Stripe.Checkout.Session;
				const userId = session.client_reference_id;
				const customerId = session.customer as string;
				const subscriptionId = session.subscription as string;

				if (!userId) {
					console.warn(
						"checkout.session.completed イベントに client_reference_id がありません。",
					);
					break;
				}

				// Stripeからサブスクリプションの詳細を取得し、トライアル期限を算出
				const subscription =
					await stripe.subscriptions.retrieve(subscriptionId);
				const status = subscription.status; // 'trialing' 等
				const trialEnd = subscription.trial_end
					? new Date(subscription.trial_end * 1000).toISOString()
					: null;

				// 1. データベース (public.users) の更新
				const { error: dbError } = await supabaseAdmin
					.from("users")
					.update({
						stripe_customer_id: customerId,
						stripe_subscription_id: subscriptionId,
						subscription_status: status,
						trial_ends_at: trialEnd,
					})
					.eq("id", userId);

				if (dbError) {
					throw new Error(
						`public.usersの更新に失敗しました: ${dbError.message}`,
					);
				}

				// 2. セッション同期のために Supabase Authのメタデータも更新
				const { error: authError } =
					await supabaseAdmin.auth.admin.updateUserById(userId, {
						user_metadata: {
							subscription_status: status,
						},
					});

				if (authError) {
					throw new Error(
						`Authユーザーメタデータの更新に失敗しました: ${authError.message}`,
					);
				}

				console.log(
					`ユーザー ${userId} のチェックアウトセッション完了処理に成功しました。`,
				);
				break;
			}

			case "customer.subscription.updated": {
				const subscription = event.data.object as Stripe.Subscription;
				const subscriptionId = subscription.id;
				const status = subscription.status;
				const trialEnd = subscription.trial_end
					? new Date(subscription.trial_end * 1000).toISOString()
					: null;

				// サブスクリプションIDからユーザーを逆引き
				const { data: user, error: userError } = await supabaseAdmin
					.from("users")
					.select("id")
					.eq("stripe_subscription_id", subscriptionId)
					.maybeSingle();

				if (userError || !user) {
					console.warn(
						`サブスクリプション ${subscriptionId} に対応するユーザーが見つかりませんでした。`,
					);
					break;
				}

				// 1. データベース更新
				const { error: dbError } = await supabaseAdmin
					.from("users")
					.update({
						subscription_status: status,
						trial_ends_at: trialEnd,
					})
					.eq("id", user.id);

				if (dbError) {
					throw new Error(
						`public.usersの更新に失敗しました(updated): ${dbError.message}`,
					);
				}

				// 2. メタデータ更新
				const { error: authError } =
					await supabaseAdmin.auth.admin.updateUserById(user.id, {
						user_metadata: {
							subscription_status: status,
						},
					});

				if (authError) {
					throw new Error(
						`Authメタデータの更新に失敗しました(updated): ${authError.message}`,
					);
				}

				console.log(
					`サブスクリプション ${subscriptionId} (ユーザー: ${user.id}) をステータス ${status} に更新しました。`,
				);
				break;
			}

			case "customer.subscription.deleted": {
				const subscription = event.data.object as Stripe.Subscription;
				const subscriptionId = subscription.id;
				const status = subscription.status; // 通常 'canceled'

				// サブスクリプションIDからユーザーを特定
				const { data: user, error: userError } = await supabaseAdmin
					.from("users")
					.select("id")
					.eq("stripe_subscription_id", subscriptionId)
					.maybeSingle();

				if (userError || !user) {
					console.warn(
						`解約されたサブスクリプション ${subscriptionId} に対応するユーザーが見つかりませんでした。`,
					);
					break;
				}

				// 1. データベース更新
				const { error: dbError } = await supabaseAdmin
					.from("users")
					.update({
						subscription_status: status,
						stripe_subscription_id: null,
					})
					.eq("id", user.id);

				if (dbError) {
					throw new Error(
						`public.usersの更新に失敗しました(deleted): ${dbError.message}`,
					);
				}

				// 2. メタデータ更新
				const { error: authError } =
					await supabaseAdmin.auth.admin.updateUserById(user.id, {
						user_metadata: {
							subscription_status: status,
						},
					});

				if (authError) {
					throw new Error(
						`Authメタデータの更新に失敗しました(deleted): ${authError.message}`,
					);
				}

				console.log(
					`ユーザー ${user.id} のサブスクリプション解約処理を完了しました。`,
				);
				break;
			}

			case "invoice.payment_failed": {
				const invoice = event.data.object as Stripe.Invoice;
				const subscriptionId = (invoice as any).subscription as
					| string
					| undefined;

				if (!subscriptionId) {
					break;
				}

				const { data: user, error: userError } = await supabaseAdmin
					.from("users")
					.select("id")
					.eq("stripe_subscription_id", subscriptionId)
					.maybeSingle();

				if (userError || !user) {
					console.warn(
						`決済失敗が発生したサブスクリプション ${subscriptionId} に対応するユーザーが見つかりませんでした。`,
					);
					break;
				}

				const failedStatus = "unpaid";

				// 1. データベース更新
				await supabaseAdmin
					.from("users")
					.update({
						subscription_status: failedStatus,
					})
					.eq("id", user.id);

				// 2. メタデータ更新
				await supabaseAdmin.auth.admin.updateUserById(user.id, {
					user_metadata: {
						subscription_status: failedStatus,
					},
				});

				console.log(
					`サブスクリプション ${subscriptionId} (ユーザー: ${user.id}) の決済失敗処理を行いました。`,
				);
				break;
			}

			default:
				console.log(`未ハンドリングのイベントタイプ: ${event.type}`);
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		console.error("Stripe Webhook処理中にエラーが発生しました:", error);
		return NextResponse.json(
			{ error: "Webhookの処理に失敗しました。" },
			{ status: 500 },
		);
	}
}
