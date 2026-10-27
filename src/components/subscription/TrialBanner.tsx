"use client";

import {
	AlertCircle,
	ChevronRight,
	Clock,
	Loader2,
	Sparkles,
} from "lucide-react";
import { useState } from "react";

interface TrialBannerProps {
	isTrialing: boolean;
	remainingDays: number;
}

export function TrialBanner({ isTrialing, remainingDays }: TrialBannerProps) {
	const [isLoading, setIsLoading] = useState(false);

	if (!isTrialing) {
		return null;
	}

	const handleSubscribe = async () => {
		setIsLoading(true);
		try {
			const res = await fetch("/api/stripe/checkout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();
			if (!res.ok || !data.url) {
				throw new Error(data.error || "決済画面の生成に失敗しました。");
			}
			window.location.href = data.url;
		} catch (err) {
			console.error("Failed to redirect to checkout:", err);
			alert(
				err instanceof Error
					? err.message
					: "決済画面への接続に失敗しました。時間をおいて再試行してください。",
			);
			setIsLoading(false);
		}
	};

	const isUrgent = remainingDays <= 7;
	const isWarning = remainingDays <= 14 && !isUrgent;

	return (
		<div
			className={`w-full border-b px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
				isUrgent
					? "bg-rose-500/10 border-rose-500/20 text-rose-200"
					: isWarning
						? "bg-amber-500/10 border-amber-500/20 text-amber-200"
						: "bg-indigo-500/10 border-indigo-500/20 text-indigo-200"
			}`}
		>
			<div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					{isUrgent ? (
						<AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
					) : isWarning ? (
						<Clock className="w-4 h-4 text-amber-400 shrink-0" />
					) : (
						<Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
					)}
					<span>
						無料体験中：残り{" "}
						<strong className="font-extrabold text-white text-sm">
							{remainingDays}日
						</strong>{" "}
						利用可能です
						{isUrgent && "（期限を過ぎると機能がロックされます）"}
					</span>
				</div>

				<button
					type="button"
					onClick={handleSubscribe}
					disabled={isLoading}
					className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer active:scale-95 disabled:opacity-50"
				>
					{isLoading ? (
						<>
							<Loader2 className="w-3 h-3 animate-spin" />
							接続中...
						</>
					) : (
						<>
							<span>カードを事前登録する</span>
							<ChevronRight className="w-3 h-3" />
						</>
					)}
				</button>
			</div>
		</div>
	);
}
