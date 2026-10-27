"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SubscribeButton } from "@/components/SubscribeButton";
import { LogOut, ShieldCheck, Sparkles, Check } from "lucide-react";

export default function SubscribePage() {
	const router = useRouter();
	const supabase = createClient();

	const handleLogout = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			router.replace("/login");
		} catch (err) {
			console.error("Logout failed:", err);
			alert("ログアウトに失敗しました。");
		}
	};

	return (
		<div className="min-h-screen bg-[#030616] text-[#e2e8f0] relative overflow-hidden font-sans flex flex-col items-center justify-center p-6 select-none">
			{/* 背景: グリッド */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

			{/* 背景: 光彩 */}
			<div className="absolute top-[20%] left-[20%] -z-10 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[130px] pointer-events-none" />
			<div className="absolute bottom-[20%] right-[20%] -z-10 h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

			{/* コンテンツ */}
			<div className="w-full max-w-lg space-y-8 relative z-10">
				{/* ヘッダーロゴ */}
				<div className="flex flex-col items-center text-center space-y-3">
					<div className="flex items-center gap-2.5">
						<Image
							src="/icon_v6.png"
							alt="YariKuru Icon"
							width={44}
							height={44}
							className="w-11 h-11 rounded-xl object-contain shadow-[0_0_20px_rgba(124,58,237,0.3)]"
						/>
						<Image
							src="/title_v2.png"
							alt="YariKuru"
							width={130}
							height={28}
							className="h-7 w-auto object-contain"
							priority
						/>
					</div>
					<p className="text-xs text-violet-400 font-semibold tracking-widest uppercase">
						Subscription Plan
					</p>
				</div>

				{/* 案内カード */}
				<div className="rounded-3xl border border-violet-500/30 bg-[#090e29]/80 backdrop-blur-2xl p-8 shadow-[0_20px_50px_rgba(124,58,237,0.1)] space-y-6">
					<div className="text-center space-y-2">
						<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-400">
							<Sparkles className="h-3.5 w-3.5" />
							プレミアムプラン登録
						</div>
						<h2 className="text-2xl font-bold text-white tracking-tight pt-2">
							クレジットカードのご登録
						</h2>
						<p className="text-slate-400 text-xs">
							これまでに登録された家計簿・予算・出費データは安全に保管されています。
						</p>
					</div>

					{/* 料金詳細 */}
					<div className="bg-[#030616]/50 border border-white/5 rounded-2xl p-5 text-center space-y-1">
						<p className="text-slate-500 text-xs font-medium">
							プレミアム月額プラン
						</p>
						<p className="text-3xl font-black text-white">
							¥150{" "}
							<span className="text-sm font-normal text-slate-500">
								/ 月額 (税込)
							</span>
						</p>

						<p className="text-emerald-400 text-xs font-semibold pt-1">
							全機能が無制限・いつでも解約可能
						</p>
					</div>

					{/* 機能リスト */}
					<ul className="space-y-3.5 text-sm text-slate-300">
						<li className="flex items-start gap-3">
							<span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
								<Check className="h-3.5 w-3.5" />
							</span>
							<span>
								保存されたこれまでの全データをそのまま引き継いで再開可能。
							</span>
						</li>
						<li className="flex items-start gap-3">
							<span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
								<Check className="h-3.5 w-3.5" />
							</span>
							<span>予算カテゴリ数の制限なし（無制限に設定可能）。</span>
						</li>
						<li className="flex items-start gap-3">
							<span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
								<Check className="h-3.5 w-3.5" />
							</span>
							<span>
								カレンダー予測管理・スナップショット振り返りなど全機能。
							</span>
						</li>
					</ul>

					{/* 決済ボタン */}
					<div className="pt-2">
						<SubscribeButton label="クレジットカードを登録して利用を再開" />
					</div>

					{/* 安心表記 */}
					<div className="flex items-center justify-center gap-2 text-slate-500 text-xs text-center border-t border-white/5 pt-5">
						<ShieldCheck className="h-4 w-4 text-emerald-500" />
						<span>Stripeによる安全なクレジットカード決済</span>
					</div>
				</div>

				{/* ログアウト */}
				<div className="flex justify-center">
					<button
						type="button"
						onClick={handleLogout}
						className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors py-2 cursor-pointer"
					>
						<LogOut className="h-3.5 w-3.5" />
						別のアカウントでログイン / ログアウト
					</button>
				</div>
			</div>
		</div>
	);
}
