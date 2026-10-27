"use client";

import { Settings } from "lucide-react";
import { AccountDeletionSection } from "./AccountDeletionSection";
import { BillingSettingsSection } from "./BillingSettingsSection";
import { DataResetSection } from "./DataResetSection";

interface SettingsClientProps {
	subscriptionStatus: string;
	trialEndsAt: string | null;
	isAdmin?: boolean;
	stripeSubscriptionId?: string | null;
}

export default function SettingsClient({
	subscriptionStatus,
	trialEndsAt,
	isAdmin = false,
	stripeSubscriptionId = null,
}: SettingsClientProps) {
	return (
		<main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full space-y-6">
			{/* ヘッダー */}
			<div className="flex items-center gap-3">
				<div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center border border-violet-500/20">
					<Settings className="w-5 h-5 text-violet-400" />
				</div>
				<div>
					<h1 className="text-xl font-bold text-slate-100">設定</h1>
					<p className="text-xs text-slate-400">
						アプリケーションの管理と各種設定を行います
					</p>
				</div>
			</div>

			{/* お支払い・プラン管理セクション */}
			<BillingSettingsSection
				subscriptionStatus={subscriptionStatus}
				trialEndsAt={trialEndsAt}
				isAdmin={isAdmin}
				stripeSubscriptionId={stripeSubscriptionId}
			/>

			{/* データの初期化セクション */}
			<DataResetSection />

			{/* アカウント削除（退会）セクション */}
			<AccountDeletionSection isAdmin={isAdmin} />
		</main>
	);
}
