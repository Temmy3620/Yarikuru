import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { calculateTrialEndsAt } from "@/lib/subscription";
import { createClient } from "./server";

/**
 * セッションを検証し、認証されていない場合はログイン画面へリダイレクトします。
 * Reactの cache APIにより、同一レンダリングパス内で複数回呼ばれてもSupabaseへの問い合わせは1回のみになります。
 */
export const verifySession = cache(async () => {
	const supabase = await createClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		redirect("/login");
	}

	return { isAuth: true, userId: user.id, email: user.email };
});

/**
 * 現在ログインしているユーザーの最小限の情報を安全に返却します。
 * 未ログイン時は null を返し、例外は発生させません（リダイレクトもしません）。
 */
export const getCurrentUser = cache(async () => {
	const supabase = await createClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		return null;
	}

	// Just In Time (JIT) 同期: public.users にプロフィールレコードがない場合は作成します
	let isAdmin = false;
	try {
		// 1. admin テーブルに登録されているか確認
		let isAdminInTable = false;
		if (user.email) {
			const { data: adminRecord } = await supabase
				.from("admin")
				.select("id")
				.eq("email", user.email)
				.maybeSingle();
			isAdminInTable = !!adminRecord;
		}

		// 2. public.users のプロフィール確認と同期
		const { data: profile } = await supabase
			.from("users")
			.select("id, is_admin")
			.eq("id", user.id)
			.maybeSingle();

		if (!profile) {
			const { error: insertError } = await supabase.from("users").insert({
				id: user.id,
				email: user.email ?? "",
				name: user.user_metadata?.name ?? "新規ユーザー",
				is_admin: isAdminInTable,
				subscription_status: isAdminInTable ? "active" : "trialing",
				trial_started_at: isAdminInTable ? null : new Date().toISOString(),
				trial_ends_at: isAdminInTable
					? null
					: calculateTrialEndsAt().toISOString(),
			});
			if (insertError) {
				console.error("JIT Sync insert error detail:", insertError);
			}
			isAdmin = isAdminInTable;
		} else {
			isAdmin = profile.is_admin ?? false;
			// admin テーブルの状態と users.is_admin が一致しない場合は同期更新
			if (profile.is_admin !== isAdminInTable) {
				const { error: updateError } = await supabase
					.from("users")
					.update({ is_admin: isAdminInTable })
					.eq("id", user.id);
				if (!updateError) {
					isAdmin = isAdminInTable;
				} else {
					console.error("Failed to update user is_admin status:", updateError);
				}
			}
		}
	} catch (err) {
		console.error("Failed to synchronize user profile in JIT logic:", err);
	}

	// DTO パターン: パスワードやメタデータなどの不要な情報を除外し、安全なデータのみを返す
	return {
		id: user.id,
		email: user.email ?? "",
		isAdmin,
	};
});
