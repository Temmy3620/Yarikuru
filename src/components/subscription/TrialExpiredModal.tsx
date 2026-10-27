"use client";

import { CheckCircle2, CreditCard, Loader2, Lock, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { DeleteAccountButton } from "@/components/DeleteAccountButton";
import { createClient } from "@/lib/supabase/client";

interface TrialExpiredModalProps {
	isOpen: boolean;
}

export function TrialExpiredModal({ isOpen }: TrialExpiredModalProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// ESCキーやブラウザ操作による閉じる挙動を完全に防止
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				e.preventDefault();
				e.stopPropagation();
			}
		};

		window.addEventListener("keydown", handleKeyDown, { capture: true });
		return () => {
			window.removeEventListener("keydown", handleKeyDown, { capture: true });
		};
	}, [isOpen]);

	if (!isOpen) {
		return null;
	}

	const handleCheckout = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const res = await fetch("/api/stripe/checkout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "決済画面の生成に失敗しました。");
			}

			if (data.url) {
				window.location.href = data.url;
			} else {
				throw new Error("決済用のURLが見つかりませんでした。");
			}
		} catch (err) {
			console.error("Trial expired checkout error:", err);
			setError(
				err instanceof Error
					? err.message
					: "決済セッションの作成に失敗しました。",
			);
			setIsLoading(false);
		}
	};

	const handleLogout = async () => {
		try {
			const supabase = createClient();
			await supabase.auth.signOut();
			window.location.href = "/login";
		} catch (err) {
			console.error("Sign out error:", err);
			window.location.href = "/login";
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300"
			role="dialog"
			aria-modal="true"
			aria-labelledby="trial-expired-title"
		>
			<div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0d1226] p-6 sm:p-8 shadow-2xl shadow-indigo-950/50 text-white overflow-hidden">
				{/* 背景のグラデーションアクセント */}
				<div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
				<div className="absolute -bottom-24 -left-24 w-60 h-60 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

				{/* アイコンとタイトル */}
				<div className="relative z-10 flex flex-col items-center text-center">
					<div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-indigo-500/20 border border-amber-500/30 flex items-center justify-center mb-5 shadow-inner">
						<Lock className="w-8 h-8 text-amber-400" />
					</div>

					<h2
						id="trial-expired-title"
						className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2"
					>
						無料体験期間が終了しました
					</h2>
					<p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
						設定された無料体験期間が終了いたしました。
						<br />
						<span className="text-emerald-400 font-medium inline-flex items-center gap-1 mt-1">
							<CheckCircle2 className="w-4 h-4" />
							登録済みの家計簿・予算・出費データは安全に保管されています
						</span>
					</p>

					{/* プラン案内カード */}
					<div className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-5 mb-6 text-left">
						<div className="flex items-baseline justify-between mb-3 border-b border-white/5 pb-3">
							<span className="text-base font-semibold text-white">
								プレミアム月額プラン
							</span>
							<span className="text-2xl font-black text-indigo-400">
								¥150{" "}
								<span className="text-xs font-normal text-slate-400">
									/ 月 (税込)
								</span>
							</span>
						</div>
						<ul className="space-y-2 text-xs sm:text-sm text-slate-300">
							<li className="flex items-center gap-2">
								<span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
								すべての家計簿・予算管理・過去履歴分析機能を無制限で利用可能
							</li>
							<li className="flex items-center gap-2">
								<span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
								いつでも設定画面から簡単に解約できます
							</li>
						</ul>
					</div>

					{/* クレジットカード登録ボタン */}
					<button
						type="button"
						onClick={handleCheckout}
						disabled={isLoading}
						className="w-full flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 cursor-pointer"
					>
						{isLoading ? (
							<>
								<Loader2 className="w-5 h-5 animate-spin" />
								決済画面へ接続中...
							</>
						) : (
							<>
								<CreditCard className="w-5 h-5" />
								クレジットカードを登録して利用を再開
							</>
						)}
					</button>

					{error && (
						<p className="mt-3 w-full text-xs text-rose-400 font-semibold bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg text-center">
							{error}
						</p>
					)}

					{/* サブ導線: ログアウト & 退会 */}
					<div className="mt-6 pt-5 border-t border-white/5 w-full flex items-center justify-between text-xs text-slate-400">
						<button
							type="button"
							onClick={handleLogout}
							className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
						>
							<LogOut className="w-3.5 h-3.5" />
							<span>ログアウト</span>
						</button>

						<div>
							<DeleteAccountButton isAdmin={false} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
