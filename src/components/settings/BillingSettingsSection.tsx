"use client";

import { useState } from "react";
import Link from "next/link";
import {
	CreditCard,
	ExternalLink,
	Loader2,
	Sparkles,
	Clock,
	CheckCircle2,
	AlertCircle,
} from "lucide-react";

interface BillingSettingsSectionProps {
	subscriptionStatus: string;
	trialEndsAt: string | null;
	isAdmin?: boolean;
}

export function BillingSettingsSection({
	subscriptionStatus,
	trialEndsAt,
	isAdmin = false,
}: BillingSettingsSectionProps) {
	const [isPortalLoading, setIsPortalLoading] = useState(false);
	const [portalError, setPortalError] = useState<string | null>(null);

	const handleOpenPortal = async () => {
		setIsPortalLoading(true);
		setPortalError(null);
		try {
			const res = await fetch("/api/stripe/portal", {
				method: "POST",
			});
			const data = await res.json();
			if (!res.ok || !data.url) {
				setPortalError(
					data.error || "カスタマーポータルの起動に失敗しました。",
				);
				setIsPortalLoading(false);
				return;
			}
			// Stripe Customer Portal へリダイレクト
			window.location.href = data.url;
		} catch (err) {
			console.error("Portal open error:", err);
			setPortalError("通信エラーが発生しました。もう一度お試しください。");
			setIsPortalLoading(false);
		}
	};

	// トライアル期間のフォーマットと残り日数の計算
	let trialEndDateFormatted = "";
	let daysRemaining: number | null = null;

	if (trialEndsAt) {
		const endDate = new Date(trialEndsAt);
		trialEndDateFormatted = endDate.toLocaleDateString("ja-JP", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
		const now = new Date();
		const diffMs = endDate.getTime() - now.getTime();
		daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
	}

	const isTrialing = subscriptionStatus === "trialing";
	const isActive = subscriptionStatus === "active";

	return (
		<div className="rounded-2xl border border-white/5 bg-[#0a0f24]/40 p-6 md:p-8 backdrop-blur-md shadow-xl space-y-5">
			{/* ヘッダー */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
						<CreditCard className="w-4 h-4 text-indigo-400" />
					</div>
					<div>
						<h2 className="text-md font-bold text-slate-200">
							お支払い・プラン情報
						</h2>
						<p className="text-xs text-slate-400">
							現在の利用プランおよび決済情報の管理
						</p>
					</div>
				</div>

				{/* ステータスバッジ */}
				<div>
					{isAdmin ? (
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 border border-purple-500/30 text-purple-300 shadow-sm shadow-purple-950/40">
							<Sparkles className="w-3.5 h-3.5 text-purple-400" />
							管理者アカウント
						</span>
					) : isTrialing ? (
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-950/40">
							<Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
							無料体験中
						</span>
					) : isActive ? (
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shadow-sm">
							<CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
							月額プラン利用中
						</span>
					) : (
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/10 border border-white/10 text-slate-400">
							フリープラン
						</span>
					)}
				</div>
			</div>

			{/* 管理者アカウントの場合 */}
			{isAdmin && (
				<div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-slate-300 leading-relaxed space-y-1">
					<p className="font-semibold text-purple-200">
						管理者特権が適用されています
					</p>
					<p className="text-slate-400">
						本環境ではStripe決済を行わずにすべての機能をご利用いただけます。管理者ユーザーのため、決済ポータルでの支払い管理は不要です。
					</p>
				</div>
			)}

			{/* トライアル中ハイライトボックス */}
			{!isAdmin && isTrialing && (
				<div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 via-teal-950/20 to-indigo-950/30 border border-emerald-500/20 space-y-2">
					<div className="flex items-center justify-between flex-wrap gap-2">
						<div className="flex items-center gap-2 text-xs font-medium text-emerald-300">
							<Clock className="w-4 h-4 text-emerald-400 shrink-0" />
							<span>
								無料トライアル終了日:{" "}
								<strong className="text-emerald-200 font-bold">
									{trialEndDateFormatted || "算出中..."}
								</strong>
							</span>
						</div>
						{daysRemaining !== null && (
							<span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
								残り {daysRemaining} 日
							</span>
						)}
					</div>
					<p className="text-xs text-slate-400 leading-relaxed pt-1">
						無料体験期間中は一切料金が発生しません。期間終了後はクレジットカードのご登録が必要となります。無料期間中でも事前にカードをご登録いただけます（残り日数が引き継がれます）。
					</p>
					<div className="pt-2">
						<Link
							href="/subscribe"
							className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-900/30"
						>
							<CreditCard className="w-3.5 h-3.5" />
							<span>クレジットカードを事前登録する</span>
						</Link>
					</div>
				</div>
			)}

			{/* 通常のアクティブプラン（有料契約中）の場合 */}
			{!isAdmin && isActive && (
				<div className="space-y-4">
					<div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-slate-300 leading-relaxed">
						プレミアム月額プランが有効です。すべての機能をご利用いただけます。次回の請求日や請求書履歴の確認、カード情報の変更はStripeカスタマーポータルより行えます。
					</div>

					{/* Stripe Customer Portal ボタン */}
					<div className="pt-1">
						<button
							type="button"
							onClick={handleOpenPortal}
							disabled={isPortalLoading}
							className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isPortalLoading ? (
								<>
									<Loader2 className="w-4 h-4 animate-spin" />
									<span>ポータルを開いています...</span>
								</>
							) : (
								<>
									<CreditCard className="w-4 h-4" />
									<span>カード情報・請求情報を管理する</span>
									<ExternalLink className="w-3.5 h-3.5 opacity-70 ml-1" />
								</>
							)}
						</button>

						{portalError && (
							<p className="text-xs text-rose-400 font-semibold mt-3">
								{portalError}
							</p>
						)}
					</div>
				</div>
			)}

			{/* 未加入（期限切れ・フリープラン）の場合 */}
			{!isAdmin && !isTrialing && !isActive && (
				<div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-3">
					<div className="flex items-center gap-2 text-xs text-slate-300">
						<AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
						<span>現在有効なプランはありません。</span>
					</div>
					<p className="text-xs text-slate-400">
						無料体験期間が終了しています。クレジットカードをご登録いただくと、すべての機能をご利用いただけます。
					</p>
					<div>
						<Link
							href="/subscribe"
							className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-violet-600/20"
						>
							<Sparkles className="w-3.5 h-3.5" />
							<span>クレジットカードを登録する</span>
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}
