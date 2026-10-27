"use client";

import { useState } from "react";
import { Loader2, CreditCard } from "lucide-react";

interface SubscribeButtonProps {
	label?: string;
}

export function SubscribeButton({
	label = "クレジットカードを登録する",
}: SubscribeButtonProps = {}) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubscribe = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/stripe/checkout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "決済セッションの作成に失敗しました。");
			}

			if (data.url) {
				// Stripe Checkout 画面へ遷移
				window.location.href = data.url;
			} else {
				throw new Error("決済用のURLが見つかりませんでした。");
			}
		} catch (err) {
			console.error("Subscription checkout error:", err);
			setError(
				err instanceof Error ? err.message : "予期しないエラーが発生しました。",
			);
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full space-y-3">
			<button
				type="button"
				onClick={handleSubscribe}
				disabled={isLoading}
				className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 text-base font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
			>
				{isLoading ? (
					<>
						<Loader2 className="h-5 w-5 animate-spin" />
						安全な決済画面へ接続中...
					</>
				) : (
					<>
						<CreditCard className="h-5 w-5" />
						{label}
					</>
				)}
			</button>
			{error && (
				<p className="text-sm text-rose-400 text-center font-medium bg-rose-500/10 border border-rose-500/20 py-2.5 px-3 rounded-lg">
					{error}
				</p>
			)}
		</div>
	);
}
