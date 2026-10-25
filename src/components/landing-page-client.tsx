"use client";

import {
	BarChart3,
	CalendarDays,
	ChevronRight,
	Flame,
	History,
	Lock,
	Mail,
	Shield,
	ShieldCheck,
	Sparkles,
	Target,
	TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import Footer from "./navigation/footer";
import { getFreeTrialDays } from "@/lib/subscription";

// イージング定義 (Sleek out-expo)
const easeOutExpo = [0.16, 1, 0.3, 1] as const;

// ヒーローセクションの時間差フェードインアニメーション用 Variants
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.1,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 30 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.8,
			ease: easeOutExpo,
		},
	},
};

const visualVariants = {
	hidden: { opacity: 0, scale: 0.96, y: 40 },
	visible: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: {
			duration: 1.0,
			ease: easeOutExpo,
			delay: 0.4, // テキストが表示された後にフワッと出す
		},
	},
};

// スクロールイン時の汎用フェードイン
const fadeInScrollVariants = {
	hidden: { opacity: 0, y: 30 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.8,
			ease: easeOutExpo,
		},
	},
};

export default function LandingPageClient() {
	const trialDays = getFreeTrialDays();

	return (
		<div className="min-h-screen bg-[#030616] text-[#e2e8f0] relative overflow-hidden font-sans select-none">
			{/* 背景: 方眼グリッド */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

			{/* 背景: グラデーション光彩 */}
			<div className="absolute top-[10%] left-[5%] -z-10 h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[130px] pointer-events-none" />
			<div className="absolute top-[40%] right-[5%] -z-10 h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
			<div className="absolute bottom-[10%] left-[20%] -z-10 h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[140px] pointer-events-none" />

			{/* ================= ヘッダー ================= */}
			<header className="sticky top-0 z-50 backdrop-blur-md border-b border-white/5 bg-[#0a0f24]/50 transition-all duration-300">
				<div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
					<div className="flex items-center gap-2.5">
						<Image
							src="/icon_v6.png"
							alt="YariKuru Logo"
							width={40}
							height={40}
							className="w-10 h-10 object-contain"
						/>
						<Image
							src="/title_v2.png"
							alt="YariKuru"
							width={120}
							height={28}
							className="h-7 w-auto object-contain"
							priority
						/>
					</div>

					<nav className="flex items-center gap-6">
						<Link
							href="/login"
							className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
						>
							ログイン
						</Link>
						<motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
							<Link
								href="/login?mode=signup"
								className="block rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:from-violet-500 hover:to-indigo-500 transition-all duration-200 cursor-pointer"
							>
								無料体験を開始
							</Link>
						</motion.div>
					</nav>
				</div>
			</header>

			<main className="relative z-10">
				{/* ================= ① ヒーローセクション ================= */}
				<section className="max-w-7xl mx-auto px-6 pt-16 pb-24 lg:pt-24 lg:pb-32 flex flex-col lg:flex-row items-center gap-16">
					<motion.div
						className="flex-1 space-y-8 text-center lg:text-left"
						variants={containerVariants}
						initial="hidden"
						animate="visible"
					>
						<motion.div
							className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-semibold text-violet-400 tracking-wide"
							variants={itemVariants}
						>
							<Sparkles className="h-3.5 w-3.5" />
							新しい「引き算」の予算管理
						</motion.div>

						<motion.h1
							className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]"
							variants={itemVariants}
						>
							「資産管理」はもうやめた。
							<br />
							<span className="bg-gradient-to-r from-[#00d2ff] via-violet-400 to-[#d87cff] bg-clip-text text-transparent">
								予算の「やりくり」
							</span>
							だけに
							<br />
							焦点をあてる、新しい家計簿。
						</motion.h1>

						<motion.p
							className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium"
							variants={itemVariants}
						>
							面倒な銀行連携や税金の計算は不要。自分でコントロールできる予算枠（やりくり予算）を決め、その中での出費・支出を管理する予算管理アプリ「YariKuru（ヤリクル）」。
						</motion.p>

						<motion.div
							className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
							variants={itemVariants}
						>
							<motion.div
								className="w-full sm:w-auto"
								whileHover={{ y: -2, scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<Link
									href="/login?mode=signup"
									className="flex items-center justify-center gap-2.5 rounded-xl border border-slate-700 bg-slate-900/60 backdrop-blur-md px-8 py-4 text-base font-semibold text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800/80 transition-all duration-200 cursor-pointer"
								>
									<Mail className="h-4.5 w-4.5" />
									メールアドレスで{trialDays}日間無料体験（クレカ不要）
								</Link>
							</motion.div>
						</motion.div>
					</motion.div>

					{/* ヒーロー右側: ダミーUIビジュアル */}
					<motion.div
						className="flex-1 w-full max-w-xl lg:max-w-none relative"
						variants={visualVariants}
						initial="hidden"
						animate="visible"
					>
						<div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-cyan-500/20 rounded-3xl blur-2xl -z-10" />

						{/* ダミーダッシュボード画面 */}
						<motion.div
							className="rounded-2xl border border-white/10 bg-[#080d28]/70 backdrop-blur-2xl p-6 lg:p-8 shadow-[0_20px_50px_rgba(3,6,22,0.6)] space-y-8 select-none"
							whileHover={{ y: -4 }}
							transition={{ duration: 0.3, ease: "easeOut" }}
						>
							<div className="flex items-center justify-between border-b border-white/5 pb-4">
								<div>
									<p className="text-xs font-semibold text-slate-400 tracking-wider">
										今月のやりくり残高
									</p>
									<p className="text-3xl font-bold text-white tracking-wide mt-1">
										¥58,420{" "}
										<span className="text-xs text-slate-500">/ ¥120,000</span>
									</p>
								</div>
								<div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
									順調（残り12日）
								</div>
							</div>

							{/* カテゴリプログレスバーのダミー */}
							<div className="space-y-6">
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span className="font-semibold text-white">🍔 食費</span>
										<span className="text-slate-400">
											¥39,000{" "}
											<span className="text-xs text-slate-600">/ ¥50,000</span>
										</span>
									</div>
									<div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-[1px]">
										<motion.div
											className="h-full rounded-full bg-gradient-to-r from-violet-600 to-[#00d2ff] relative shadow-[0_0_10px_rgba(0,210,255,0.5)]"
											initial={{ width: 0 }}
											animate={{ width: "78%" }}
											transition={{
												duration: 1.2,
												ease: easeOutExpo,
												delay: 0.6,
											}}
										/>
									</div>
									<p className="text-right text-[10px] text-violet-400 font-medium">
										消化率 78% (予算枠まで ¥11,000)
									</p>
								</div>

								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span className="font-semibold text-white">
											🎨 趣味・推し活
										</span>
										<span className="text-slate-400">
											¥13,500{" "}
											<span className="text-xs text-slate-600">/ ¥30,000</span>
										</span>
									</div>
									<div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-[1px]">
										<motion.div
											className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(52,211,153,0.4)]"
											initial={{ width: 0 }}
											animate={{ width: "45%" }}
											transition={{
												duration: 1.2,
												ease: easeOutExpo,
												delay: 0.8,
											}}
										/>
									</div>
									<p className="text-right text-[10px] text-emerald-400 font-medium">
										消化率 45% (予算枠まで ¥16,500)
									</p>
								</div>

								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span className="font-semibold text-white">
											☕ カフェ・日常雑費
										</span>
										<span className="text-slate-400">
											¥9,080{" "}
											<span className="text-xs text-slate-600">/ ¥15,000</span>
										</span>
									</div>
									<div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-[1px]">
										<motion.div
											className="h-full rounded-full bg-gradient-to-r from-[#ffd280] to-[#f43f5e] shadow-[0_0_10px_rgba(244,63,94,0.4)]"
											initial={{ width: 0 }}
											animate={{ width: "60%" }}
											transition={{
												duration: 1.2,
												ease: easeOutExpo,
												delay: 1.0,
											}}
										/>
									</div>
									<p className="text-right text-[10px] text-rose-400 font-medium">
										消化率 60% (予算枠まで ¥5,920)
									</p>
								</div>
							</div>
						</motion.div>
					</motion.div>
				</section>

				{/* ================= ② コンセプト・フィロソフィー ================= */}
				<section className="border-t border-white/5 bg-[#05081d]/50 py-24 lg:py-32 relative overflow-hidden">
					{/* 背景光彩 */}
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[700px] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none" />

					<div className="max-w-5xl mx-auto px-6 space-y-14">
						{/* ヘッダー部分 */}
						<motion.div
							className="space-y-6 text-center max-w-3xl mx-auto"
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-100px" }}
							variants={fadeInScrollVariants}
						>
							<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#00d2ff]/30 bg-[#00d2ff]/10 text-xs font-semibold text-[#00d2ff] tracking-wider uppercase">
								Concept & Philosophy
							</div>

							<h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.3]">
								<span className="block">人の欲望は無限大。</span>
								<span className="block mt-2 sm:mt-3">
									<span className="inline-block">だからこそ</span>{" "}
									<span className="inline-block bg-gradient-to-r from-[#00d2ff] via-violet-400 to-[#d87cff] bg-clip-text text-transparent px-1">
										<span className="inline-block">「コントロールできる</span>
										<span className="inline-block">お金」</span>
									</span>
									<span className="inline-block">に絞る</span>
								</span>
							</h2>

							<div className="pt-2">
								<p className="text-base sm:text-lg md:text-xl text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
									「毎月何にいくら使ったか」をすべて細かく記録しようとして、
									<br className="hidden sm:inline" />
									途中で疲れてやめてしまった経験はありませんか？
								</p>
							</div>
						</motion.div>

						{/* 固定費 vs 変動費の対比グリッド */}
						<div className="grid md:grid-cols-2 gap-8 relative">
							{/* 左：固定費 */}
							<motion.div
								className="rounded-2xl border border-white/5 bg-slate-900/40 p-8 space-y-5 relative overflow-hidden backdrop-blur-md"
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true, margin: "-100px" }}
								variants={fadeInScrollVariants}
								whileHover={{ y: -4, borderColor: "rgba(255, 255, 255, 0.1)" }}
								transition={{ duration: 0.3 }}
							>
								<div className="flex items-center justify-between">
									<div className="h-11 w-11 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400">
										<Lock className="h-5 w-5" />
									</div>
									<span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/50">
										自分では動かせないお金
									</span>
								</div>

								<div className="space-y-3">
									<h3 className="text-xl font-bold text-slate-200">
										「固定費」を記録するストレス
									</h3>
									<p className="text-slate-400 text-sm leading-relaxed">
										家賃や税金、通信費などの
										<strong className="text-slate-200 font-medium">
											「固定費」
										</strong>
										は、生きていくうえでどうしても出ていく、自分ではすぐには減らせないお金です。
									</p>
									<p className="text-slate-400 text-sm leading-relaxed">
										これらを毎回細かく記録・管理しようとすること自体が、家計簿が続かない大きなストレスの原因になっています。
									</p>
								</div>
							</motion.div>

							{/* 右：変動費 */}
							<motion.div
								className="rounded-2xl border border-violet-500/30 bg-gradient-to-b from-violet-950/20 to-slate-950/60 p-8 space-y-5 relative overflow-hidden backdrop-blur-md shadow-[0_0_30px_rgba(139,92,246,0.1)]"
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true, margin: "-100px" }}
								variants={fadeInScrollVariants}
								whileHover={{ y: -4, borderColor: "rgba(0, 210, 255, 0.4)" }}
								transition={{ duration: 0.3 }}
							>
								<div className="flex items-center justify-between">
									<div className="h-11 w-11 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-[#00d2ff]">
										<Flame className="h-5 w-5" />
									</div>
									<span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md bg-violet-500/10 text-violet-300 border border-violet-500/30">
										意識ひとつで制限できるお金
									</span>
								</div>

								<div className="space-y-3">
									<h3 className="text-xl font-bold text-white">
										欲望と隣り合わせの「変動費」
									</h3>
									<p className="text-slate-300 text-sm leading-relaxed">
										ネットショッピングや推し活、趣味、日々の外食といった
										<strong className="text-white font-semibold">
											「変動費」
										</strong>
										は、自分の意識ひとつでコントロールできるお金です。
									</p>
									<p className="text-slate-300 text-sm leading-relaxed">
										しかし、人の欲望には際限がありません。自制しないとお金は無限に出ていってしまうからこそ、特別な管理が必要です。
									</p>
								</div>
							</motion.div>
						</div>

						{/* 結論：やりくり枠への集中 */}
						<motion.div
							className="rounded-2xl border border-[#00d2ff]/30 bg-gradient-to-r from-cyan-950/20 via-violet-950/30 to-indigo-950/20 backdrop-blur-md p-8 md:p-10 text-center max-w-4xl mx-auto space-y-4 shadow-[0_0_40px_rgba(0,210,255,0.08)] relative"
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-100px" }}
							variants={fadeInScrollVariants}
							whileHover={{ scale: 1.01 }}
							transition={{ duration: 0.3 }}
						>
							<div className="inline-flex items-center gap-2 text-[#00d2ff] font-bold text-xs uppercase tracking-wider">
								<Sparkles className="h-4 w-4" />
								ストレスなくお金と上手に付き合う唯一のコツ
							</div>
							<p className="text-lg md:text-2xl font-bold text-white leading-relaxed">
								「自分でコントロールできる支出だけに上限（やりくり枠）を決め、
								<br className="hidden md:inline" />
								<span className="bg-gradient-to-r from-[#00d2ff] via-violet-300 to-[#d87cff] bg-clip-text text-transparent">
									そこだけを集中管理する
								</span>
								」
							</p>
							<p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
								これが、無理な我慢や記録疲れから解放され、楽しく自制心とお金を両立させるYariKuruの哲学です。
							</p>
						</motion.div>
					</div>
				</section>

				{/* ================= ③ YariKuruが提供する3つの価値 ================= */}
				<section className="max-w-7xl mx-auto px-6 py-24 lg:py-28 space-y-16">
					<motion.div
						className="text-center space-y-4 max-w-3xl mx-auto"
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, margin: "-100px" }}
						variants={fadeInScrollVariants}
					>
						<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-semibold text-violet-400 tracking-wider uppercase">
							Core Values
						</div>
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
							YariKuruが提供する3つの価値
						</h2>
						<p className="text-slate-400 text-base md:text-lg">
							動かせないお金のノイズを取り払い、本当に大切な枠組みだけに意識を向けます。
						</p>
					</motion.div>

					<div className="grid md:grid-cols-3 gap-8">
						{/* 価値1 */}
						<motion.div
							className="rounded-2xl border border-white/5 bg-[#070b20]/60 p-8 hover:border-emerald-500/30 transition-all duration-300 group flex flex-col justify-between backdrop-blur-sm relative overflow-hidden"
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-80px" }}
							variants={fadeInScrollVariants}
							whileHover={{ y: -6, scale: 1.01 }}
							whileTap={{ scale: 0.985 }}
						>
							<div className="space-y-5">
								<div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
									<ShieldCheck className="h-6 w-6 text-white" />
								</div>
								<h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors duration-200">
									固定費管理のストレスをゼロに
								</h3>
								<p className="text-slate-400 text-sm leading-relaxed">
									自分では動かせないお金のノイズを排除し、管理の手間を最小限にします。日々の記録に追われることがなくなります。
								</p>
							</div>
							<div className="pt-6 border-t border-white/5 mt-6 text-xs text-emerald-400/80 font-medium">
								手間と罪悪感の最小化
							</div>
						</motion.div>

						{/* 価値2 */}
						<motion.div
							className="rounded-2xl border border-white/5 bg-[#070b20]/60 p-8 hover:border-violet-500/30 transition-all duration-300 group flex flex-col justify-between backdrop-blur-sm relative overflow-hidden"
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-80px" }}
							variants={fadeInScrollVariants}
							whileHover={{ y: -6, scale: 1.01 }}
							whileTap={{ scale: 0.985 }}
						>
							<div className="space-y-5">
								<div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.3)]">
									<Target className="h-6 w-6 text-white" />
								</div>
								<h3 className="text-xl font-bold text-white group-hover:text-[#00d2ff] transition-colors duration-200">
									「やりくり枠」を集中管理
								</h3>
								<p className="text-slate-400 text-sm leading-relaxed">
									ネットショッピングや推し活など、予算を決めて管理することで「今月あといくら使えるか」が一目で直感的にわかります。
								</p>
							</div>
							<div className="pt-6 border-t border-white/5 mt-6 text-xs text-violet-400/80 font-medium">
								ネットショッピング・推し活・外食
							</div>
						</motion.div>

						{/* 価値3 */}
						<motion.div
							className="rounded-2xl border border-white/5 bg-[#070b20]/60 p-8 hover:border-rose-500/30 transition-all duration-300 group flex flex-col justify-between backdrop-blur-sm relative overflow-hidden"
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-80px" }}
							variants={fadeInScrollVariants}
							whileHover={{ y: -6, scale: 1.01 }}
							whileTap={{ scale: 0.985 }}
						>
							<div className="space-y-5">
								<div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.3)]">
									<TrendingUp className="h-6 w-6 text-white" />
								</div>
								<h3 className="text-xl font-bold text-white group-hover:text-rose-300 transition-colors duration-200">
									無駄なお金が出ていくのを防ぐ
								</h3>
								<p className="text-slate-400 text-sm leading-relaxed">
									あらかじめ決めた枠の中で楽しくやりくりし、自制心と安心感を両立させます。衝動買いを未然にコントロールできます。
								</p>
							</div>
							<div className="pt-6 border-t border-white/5 mt-6 text-xs text-rose-400/80 font-medium">
								自制心と安心感の両立
							</div>
						</motion.div>
					</div>
				</section>

				{/* ================= ④ 特徴・機能セクション ================= */}
				<section className="max-w-7xl mx-auto px-6 py-24 lg:py-32 space-y-16 border-t border-white/5">
					<motion.div
						className="text-center space-y-4"
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, margin: "-100px" }}
						variants={fadeInScrollVariants}
					>
						<h2 className="text-xs font-bold tracking-widest text-violet-400 uppercase">
							Features
						</h2>
						<p className="text-3xl md:text-4xl font-bold text-white tracking-tight">
							やりくりを楽しく、美しく続けるための機能
						</p>
					</motion.div>

					<div className="grid md:grid-cols-3 gap-8">
						{/* 特徴1 */}
						<motion.div
							className="rounded-2xl border border-white/5 bg-[#070b20]/50 p-8 hover:border-violet-500/30 transition-all duration-300 group flex flex-col justify-between"
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-80px" }}
							variants={fadeInScrollVariants}
							whileHover={{ y: -6, scale: 1.01 }}
							whileTap={{ scale: 0.985 }}
						>
							<div className="space-y-6">
								<div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.3)]">
									<BarChart3 className="h-6 w-6 text-white" />
								</div>
								<h3 className="text-xl font-bold text-white group-hover:text-[#00d2ff] transition-colors duration-200">
									直感的なカラープログレスバーによる予算可視化
								</h3>
								<p className="text-slate-400 text-sm leading-relaxed">
									食費や娯楽など、カテゴリごとに設定した予算に対する現在の消化状況を美しいカラーグラデーションバーで直感的に表示。「残りいくら使えるか」が一目で分かります。
								</p>
							</div>
							<div className="pt-6 border-t border-white/5 mt-6 text-xs text-slate-500 font-medium">
								グラデーションカラー / カテゴリ設定自由
							</div>
						</motion.div>

						{/* 特徴2 */}
						<motion.div
							className="rounded-2xl border border-white/5 bg-[#070b20]/50 p-8 hover:border-violet-500/30 transition-all duration-300 group flex flex-col justify-between"
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-80px" }}
							variants={fadeInScrollVariants}
							whileHover={{ y: -6, scale: 1.01 }}
							whileTap={{ scale: 0.985 }}
						>
							<div className="space-y-6">
								<div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.3)]">
									<History className="h-6 w-6 text-white" />
								</div>
								<h3 className="text-xl font-bold text-white group-hover:text-[#00d2ff] transition-colors duration-200">
									過去を美しく振り返る「スナップショット履歴」
								</h3>
								<p className="text-slate-400 text-sm leading-relaxed">
									予算設定を追加・更新・削除しても過去の集計データがズレないよう、操作時点で全予算設定の「スナップショット」を履歴テーブルに自動保存。当時の正しい数字を100%復元して振り返ることができます。
								</p>
							</div>
							<div className="pt-6 border-t border-white/5 mt-6 text-xs text-slate-500 font-medium">
								履歴スナップショット機能 / JSON自動保存
							</div>
						</motion.div>

						{/* 特徴3 */}
						<motion.div
							className="rounded-2xl border border-white/5 bg-[#070b20]/50 p-8 hover:border-violet-500/30 transition-all duration-300 group flex flex-col justify-between"
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-80px" }}
							variants={fadeInScrollVariants}
							whileHover={{ y: -6, scale: 1.01 }}
							whileTap={{ scale: 0.985 }}
						>
							<div className="space-y-6">
								<div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.3)]">
									<CalendarDays className="h-6 w-6 text-white" />
								</div>
								<h3 className="text-xl font-bold text-white group-hover:text-[#00d2ff] transition-colors duration-200">
									未来の予定を書き込める「来月以降の予想出費」
								</h3>
								<p className="text-slate-400 text-sm leading-relaxed">
									「来月の友人の結婚式」や「半年後の車検」のような、未来の予想出費を前もって登録できます。前もって予定を把握できるため、今月慌てることなく計画的に予算を切り出せます。
								</p>
							</div>
							<div className="pt-6 border-t border-white/5 mt-6 text-xs text-slate-500 font-medium">
								予想出費カレンダー連携 / 計画的なやりくり
							</div>
						</motion.div>
					</div>
				</section>

				{/* ================= ⑤ 使い方ステップ ================= */}
				<section className="border-t border-white/5 bg-[#05081d]/30 py-24 relative">
					<div className="max-w-7xl mx-auto px-6 space-y-16">
						<motion.div
							className="text-center space-y-4"
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-100px" }}
							variants={fadeInScrollVariants}
						>
							<h2 className="text-xs font-bold tracking-widest text-[#00d2ff] uppercase">
								How It Works
							</h2>
							<p className="text-3xl md:text-4xl font-bold text-white tracking-tight">
								3ステップで始める快適やりくり
							</p>
						</motion.div>

						<div className="grid md:grid-cols-3 gap-12 relative">
							{/* ステップ1 */}
							<motion.div
								className="space-y-4 text-center md:text-left relative"
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true, margin: "-100px" }}
								variants={fadeInScrollVariants}
							>
								<div className="inline-flex h-12 w-12 rounded-xl bg-gradient-to-br from-[#00d2ff] to-[#0066ff] items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(0,102,255,0.4)]">
									1
								</div>
								<h3 className="text-lg font-bold text-white">ログイン</h3>
								<p className="text-slate-400 text-sm leading-relaxed">
									メールアドレスで10秒でご自身のプライベートスペースを開設できます。
								</p>
							</motion.div>

							{/* ステップ2 */}
							<motion.div
								className="space-y-4 text-center md:text-left relative"
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true, margin: "-100px" }}
								variants={fadeInScrollVariants}
							>
								<div className="inline-flex h-12 w-12 rounded-xl bg-gradient-to-br from-[#00d2ff] to-[#0066ff] items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(0,102,255,0.4)]">
									2
								</div>
								<h3 className="text-lg font-bold text-white">予算を決める</h3>
								<p className="text-slate-400 text-sm leading-relaxed">
									今月コントロールしたいカテゴリと枠（例：食費 ¥50,000、推し活
									¥20,000など）を自由に設定します。
								</p>
							</motion.div>

							{/* ステップ3 */}
							<motion.div
								className="space-y-4 text-center md:text-left relative"
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true, margin: "-100px" }}
								variants={fadeInScrollVariants}
							>
								<div className="inline-flex h-12 w-12 rounded-xl bg-gradient-to-br from-[#00d2ff] to-[#0066ff] items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(0,102,255,0.4)]">
									3
								</div>
								<h3 className="text-lg font-bold text-white">サクッと入力</h3>
								<p className="text-slate-400 text-sm leading-relaxed">
									PCでもスマートフォンでも、使った金額を入れてカテゴリを選ぶだけ。カラーゲージがリアルタイムに更新されます。
								</p>
							</motion.div>
						</div>
					</div>
				</section>

				{/* ================= ⑥ セキュリティ・信頼性 ================= */}
				<section className="max-w-5xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-12">
					<motion.div
						className="flex-1 space-y-6"
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, margin: "-100px" }}
						variants={fadeInScrollVariants}
					>
						<div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold">
							<Shield className="h-4 w-4" />
							エンタープライズ級の保護性能
						</div>
						<h2 className="text-3xl font-bold text-white tracking-tight">
							「あなたのデータは、あなただけのもの」
						</h2>
						<p className="text-slate-400 text-sm leading-relaxed">
							YariKuruは、堅牢なクラウドインフラであるデータベース「Supabase」を採用。
							強固な「行レベルセキュリティ（RLS）」の仕組みによって、登録された情報は本人以外のアクセスが完全に遮断され、暗号化されて隔離されます。外部の口座接続データを保管しないため、漏洩や乗っ取りのリスクも極小です。
						</p>
						<div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
							<Lock className="h-4 w-4" />
							行レベルセキュリティ (RLS) 適用済み / 安全なSSL通信
						</div>
					</motion.div>
					<motion.div
						className="w-full md:w-[320px] shrink-0 flex items-center justify-center"
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, margin: "-100px" }}
						variants={fadeInScrollVariants}
					>
						<motion.div
							className="relative p-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_40px_rgba(16,185,129,0.1)] text-center space-y-4"
							whileHover={{ scale: 1.03, rotate: 1 }}
							transition={{ duration: 0.3 }}
						>
							<div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
								<Lock className="h-8 w-8" />
							</div>
							<p className="text-sm font-bold text-white">セキュア設計</p>
							<p className="text-xs text-slate-400 leading-relaxed">
								データの閲覧・更新は検証済みのアクセストークンを持つ所有者本人にのみ認可されます。
							</p>
						</motion.div>
					</motion.div>
				</section>

				{/* ================= ⑦ 料金プラン ================= */}
				<section className="border-t border-white/5 bg-[#05081d]/40 py-24">
					<div className="max-w-7xl mx-auto px-6 space-y-16">
						<motion.div
							className="text-center space-y-4"
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-100px" }}
							variants={fadeInScrollVariants}
						>
							<h2 className="text-xs font-bold tracking-widest text-violet-400 uppercase">
								Pricing
							</h2>
							<p className="text-3xl md:text-4xl font-bold text-white tracking-tight">
								シンプルで透明な料金プラン
							</p>
						</motion.div>

						<motion.div
							className="max-w-md mx-auto"
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-100px" }}
							variants={fadeInScrollVariants}
						>
							<motion.div
								className="rounded-3xl border-2 border-violet-500 bg-[#090e29] p-8 shadow-[0_0_40px_rgba(124,58,237,0.15)]"
								whileHover={{ y: -4, scale: 1.01 }}
								whileTap={{ scale: 0.99 }}
								transition={{ duration: 0.3 }}
							>
								<div className="space-y-6">
									<div>
										<h3 className="text-2xl font-bold text-white">
											スタンダードプラン
										</h3>
										<p className="text-slate-400 text-xs mt-1">
											日々のやりくりを美しく可視化するすべての機能
										</p>
									</div>

									<div className="flex items-baseline text-white">
										<span className="text-4xl font-extrabold tracking-tight">
											¥150
										</span>
										<span className="ml-1 text-sm font-semibold text-slate-500">
											/ 月額 (初回{trialDays}日間無料)
										</span>
									</div>

									<ul className="space-y-4 border-t border-white/5 pt-6 text-sm text-slate-300">
										<li className="flex items-center gap-3 font-semibold text-violet-400">
											<span className="text-violet-400 font-bold">✓</span>
											初回{trialDays}日間無料体験（クレジットカード不要）
										</li>
										<li className="flex items-center gap-3">
											<span className="text-violet-400 font-bold">✓</span>
											予算カテゴリ数無制限
										</li>
										<li className="flex items-center gap-3">
											<span className="text-violet-400 font-bold">✓</span>
											カテゴリ別カラープログレスバー
										</li>
										<li className="flex items-center gap-3">
											<span className="text-violet-400 font-bold">✓</span>
											来月以降の予想出費カレンダー管理
										</li>
										<li className="flex items-center gap-3">
											<span className="text-violet-400 font-bold">✓</span>
											月別スナップショット振り返り機能
										</li>
										<li className="flex items-center gap-3">
											<span className="text-violet-400 font-bold">✓</span>
											セキュアなメールアドレス・パスワード認証
										</li>
									</ul>

									<Link
										href="/login?mode=signup"
										className="flex w-full justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:from-violet-500 hover:to-indigo-500 transition-all duration-200 text-center cursor-pointer"
									>
										{trialDays}日間無料で試してみる
									</Link>
								</div>
							</motion.div>
						</motion.div>
					</div>
				</section>

				{/* ================= ⑧ フッター前の最終CTA ================= */}
				<section className="relative py-24 lg:py-32 overflow-hidden border-t border-white/5">
					<div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0c1b]/30 -z-10" />

					<div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative">
						<motion.h2
							className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, ease: easeOutExpo }}
						>
							YariKuru で予算をコントロールして、
							<br />
							本当に大切なことにお金を使いましょう。
						</motion.h2>
						<motion.p
							className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.1 }}
						>
							もう口座明細のチェックに追われる必要はありません。自分で作った予算の枠の中で、気持ちよく暮らす体験を今すぐ始めましょう。
						</motion.p>
						<motion.div
							className="pt-4"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.2 }}
						>
							<motion.div
								className="inline-block"
								whileHover={{ scale: 1.03 }}
								whileTap={{ scale: 0.97 }}
							>
								<Link
									href="/login?mode=signup"
									className="inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#00d2ff] to-[#0066ff] px-10 py-5 text-lg font-bold text-white shadow-[0_0_30px_rgba(0,210,255,0.4)] hover:from-[#00e1ff] hover:to-[#0077ff] transition-all duration-300 cursor-pointer"
								>
									{trialDays}日間無料で試してみる
									<ChevronRight className="h-5 w-5" />
								</Link>
							</motion.div>
						</motion.div>
					</div>
				</section>
			</main>

			{/* ================= フッター ================= */}
			<Footer />
		</div>
	);
}
