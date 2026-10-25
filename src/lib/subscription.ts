/**
 * サブスクリプションおよび無料トライアルの判定・計算ユーティリティ
 */

export interface SubscriptionEvaluation {
	isAdmin: boolean;
	status:
		| "admin"
		| "active"
		| "trialing"
		| "trial_expired"
		| "canceled"
		| "past_due";
	trialEndsAt: Date | null;
	hasActiveSubscription: boolean;
	isTrialing: boolean;
	isTrialExpired: boolean;
	remainingDays: number;
}

/**
 * 環境変数から無料トライアル日数（デフォルト: 60日）を取得
 */
export function getFreeTrialDays(): number {
	const envDays = process.env.NEXT_PUBLIC_FREE_TRIAL_DAYS;
	const parsed = envDays ? Number.parseInt(envDays, 10) : 60;
	return Number.isNaN(parsed) || parsed <= 0 ? 60 : parsed;
}

/**
 * 指定日時（デフォルトは現在）に無料トライアル日数を加算した終了日時を算出
 */
export function calculateTrialEndsAt(startDate: Date = new Date()): Date {
	const days = getFreeTrialDays();
	const endsAt = new Date(startDate);
	endsAt.setDate(endsAt.getDate() + days);
	return endsAt;
}

/**
 * トライアル終了日までの残り日数を算出（0日以上の整数）
 */
export function calculateRemainingTrialDays(
	trialEndsAt: string | Date | null | undefined,
): number {
	if (!trialEndsAt) return 0;
	const end = new Date(trialEndsAt);
	const now = new Date();
	if (end <= now) return 0;
	return Math.max(
		0,
		Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
	);
}

/**
 * ユーザー情報からサブスクリプションおよび無料トライアル状態を総合判定
 */
export function evaluateSubscription(user: {
	is_admin?: boolean | null;
	subscription_status?: string | null;
	trial_ends_at?: string | Date | null;
	stripe_subscription_id?: string | null;
}): SubscriptionEvaluation {
	const isAdmin = user.is_admin === true;

	if (isAdmin) {
		return {
			isAdmin: true,
			status: "admin",
			trialEndsAt: null,
			hasActiveSubscription: true,
			isTrialing: false,
			isTrialExpired: false,
			remainingDays: 9999,
		};
	}

	const now = new Date();
	const trialEndsAt = user.trial_ends_at ? new Date(user.trial_ends_at) : null;
	const rawStatus = user.subscription_status || "free";
	const isPaidActive = rawStatus === "active";
	const hasStripeSub = Boolean(user.stripe_subscription_id);

	// Stripe有料契約がなく、trial_ends_atが未来の場合 -> 無料体験中 (trialing)
	const isTrialing =
		!isPaidActive && !hasStripeSub && Boolean(trialEndsAt && trialEndsAt > now);

	// Stripe有料契約がなく、trial_ends_atが過去または未設定 -> 無料期限切れ (trial_expired)
	const isTrialExpired =
		!isPaidActive && !hasStripeSub && (!trialEndsAt || trialEndsAt <= now);

	// 有効な利用権限があるか（管理者、有料契約中、または無料体験中）
	const hasActiveSubscription = isPaidActive || isTrialing;

	const remainingDays =
		isTrialing && trialEndsAt ? calculateRemainingTrialDays(trialEndsAt) : 0;

	let status: SubscriptionEvaluation["status"] = "trial_expired";
	if (isPaidActive) {
		status = "active";
	} else if (isTrialing) {
		status = "trialing";
	} else if (rawStatus === "canceled") {
		status = "canceled";
	} else if (rawStatus === "past_due") {
		status = "past_due";
	} else {
		status = "trial_expired";
	}

	return {
		isAdmin: false,
		status,
		trialEndsAt,
		hasActiveSubscription,
		isTrialing,
		isTrialExpired,
		remainingDays,
	};
}
