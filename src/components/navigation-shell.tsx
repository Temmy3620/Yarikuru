"use client";

import { useState } from "react";
import Header from "./navigation/header";
import Sidebar from "./navigation/sidebar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { evaluateSubscription } from "@/lib/subscription";
import { TrialExpiredModal } from "./subscription/TrialExpiredModal";
import { TrialBanner } from "./subscription/TrialBanner";

interface NavigationShellProps {
	children: React.ReactNode;
	userEmail?: string;
}

export default function NavigationShell({
	children,
	userEmail,
}: NavigationShellProps) {
	const [isOpen, setIsOpen] = useState(false);
	const { user, isLoading } = useCurrentUser();
	const userName = user?.name ?? "";

	const subEval = evaluateSubscription({
		is_admin: user?.isAdmin,
		subscription_status: user?.subscriptionStatus,
		trial_ends_at: user?.trialEndsAt,
		stripe_subscription_id: user?.stripeSubscriptionId,
	});

	const isBlocked = !isLoading && user && subEval.isTrialExpired;

	return (
		<div className="min-h-screen bg-[#030616] text-white flex flex-col">
			{/* 無料体験中の残り日数バナー */}
			{!isLoading && user && subEval.isTrialing && (
				<TrialBanner
					isTrialing={true}
					remainingDays={subEval.remainingDays}
				/>
			)}


			<Header
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				userEmail={userEmail}
				userName={userName}
			/>
			<Sidebar
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				userEmail={userEmail}
				userName={userName}
			/>

			{/* メインコンテンツエリア（期限切れ時は操作不可・背景ぼかし） */}
			<div
				className={`flex-1 flex flex-col relative z-0 transition-all duration-300 ${
					isBlocked ? "pointer-events-none select-none blur-xs opacity-40" : ""
				}`}
			>
				{children}
			</div>

			{/* 無料期間終了時のクレジットカード登録モーダル（操作完全ブロック） */}
			<TrialExpiredModal isOpen={Boolean(isBlocked)} />

		</div>
	);
}

