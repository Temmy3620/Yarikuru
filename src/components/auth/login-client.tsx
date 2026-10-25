"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import type { FormState } from "@/types/form";
import type { LoginFormErrors, SignupFormErrors } from "@/types/auth";
import { KeyVisual } from "@/components/auth/key-visual";
import { SuccessMessage } from "@/components/auth/success-message";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import Footer from "@/components/navigation/footer";
import { AnimatePresence, motion } from "motion/react";
import { getFreeTrialDays } from "@/lib/subscription";

interface LoginClientProps {
	loginAction: (
		state: FormState<LoginFormErrors>,
		formData: FormData,
	) => Promise<FormState<LoginFormErrors>>;
	signupAction: (
		state: FormState<SignupFormErrors>,
		formData: FormData,
	) => Promise<FormState<SignupFormErrors>>;
	initialMode?: "login" | "signup";
}

export default function LoginClient({
	loginAction,
	signupAction,
	initialMode = "login",
}: LoginClientProps) {
	const [mode, setMode] = useState<"login" | "signup">(initialMode);
	const [loginState, runLogin, loginPending] = useActionState(
		loginAction,
		undefined,
	);
	const [signupState, runSignup, signupPending] = useActionState(
		signupAction,
		undefined,
	);

	const isLogin = mode === "login";

	return (
		<div className="min-h-screen bg-[#030616] text-white flex flex-col justify-between">
			<div className="relative flex flex-1 flex-col md:flex-row overflow-hidden">
				{/* 背景のグリッド線 (方眼) */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

				{/* ================= 左カラム: イラスト＆ロゴエリア ================= */}
				<KeyVisual />

				{/* ================= 右カラム: ログインフォームエリア ================= */}
				<motion.div
					className="w-full md:w-[460px] lg:w-[500px] flex flex-col justify-center px-8 py-16 md:px-12 bg-[#0a0f24]/30 backdrop-blur-xl relative"
					initial={{ opacity: 0, scale: 0.96 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
				>
					{/* LPへ戻るリンク */}
					<Link
						href="/"
						className="absolute top-6 left-8 text-xs font-semibold text-[#8c9fc2]/60 hover:text-white transition-colors duration-200 cursor-pointer"
					>
						← LPへ戻る
					</Link>

					{/* 背景のグラデーション光彩球 */}
					<div className="absolute top-[30%] right-[10%] -z-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />
					<div className="absolute bottom-[20%] right-[20%] -z-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-[90px] pointer-events-none" />

					{/* 右下のキラキラ星マーク */}
					<svg
						className="absolute bottom-12 right-12 text-[#ffd280]/40 animate-pulse pointer-events-none hidden md:block"
						width="36"
						height="36"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden="true"
					>
						<path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" />
					</svg>

					<div className="w-full max-w-sm mx-auto space-y-8">
						{/* タブヘッダー (Goldwin風レイアウト) */}
						<div className="flex border-b border-slate-800 text-center text-sm font-semibold tracking-wider">
							<button
								type="button"
								onClick={() => setMode("login")}
								className={`flex-1 pb-4 border-b-2 tracking-wider font-semibold transition-colors duration-200 cursor-pointer ${
									isLogin
										? "border-violet-500 text-white"
										: "border-transparent text-slate-500 hover:text-slate-300"
								}`}
							>
								ログイン
							</button>
							<button
								type="button"
								onClick={() => setMode("signup")}
								className={`flex-1 pb-4 border-b-2 tracking-wider font-semibold transition-colors duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
									!isLogin
										? "border-violet-500 text-white"
										: "border-transparent text-slate-500 hover:text-slate-300"
								}`}
							>
								<span>会員登録</span>
								<span className="text-[10px] bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded-full border border-violet-500/30">
									{getFreeTrialDays()}日無料
								</span>
							</button>
						</div>

						<AnimatePresence mode="wait">
							<motion.div
								key={mode + (signupState?.success ? "-success" : "")}
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -8 }}
								transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
							>
								{!isLogin && signupState?.success && signupState?.message ? (
									<SuccessMessage
										message={signupState.message}
										onBackToLogin={() => setMode("login")}
									/>
								) : isLogin ? (
									<LoginForm
										action={runLogin}
										pending={loginPending}
										state={loginState}
									/>
								) : (
									<SignupForm
										action={runSignup}
										pending={signupPending}
										state={signupState}
									/>
								)}
							</motion.div>
						</AnimatePresence>
					</div>
				</motion.div>
			</div>
			<Footer />
		</div>
	);
}
