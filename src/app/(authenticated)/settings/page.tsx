import SettingsClient from "@/components/settings/settings-client";
import { getCurrentUser } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
	title: "設定 - YariKuru",
	description: "アプリケーションの管理と各種設定を行います",
};

export default async function SettingsPage() {
	const user = await getCurrentUser();
	if (!user) return null;

	const supabase = await createClient();
	const { data: dbUser } = await supabase
		.from("users")
		.select(
			"subscription_status, trial_ends_at, is_admin, stripe_subscription_id",
		)
		.eq("id", user.id)
		.maybeSingle();

	return (
		<SettingsClient
			subscriptionStatus={dbUser?.subscription_status ?? "free"}
			trialEndsAt={dbUser?.trial_ends_at ?? null}
			isAdmin={dbUser?.is_admin ?? false}
			stripeSubscriptionId={dbUser?.stripe_subscription_id ?? null}
		/>
	);
}
