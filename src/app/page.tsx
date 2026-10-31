import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LandingPageClient from "@/components/landing-page-client";
import { createClient } from "@/lib/supabase/server";

const defaultUrl = (
	process.env.NEXT_PUBLIC_APP_URL || "https://yarikuru.temmylabo.app"
)
	.trim()
	.replace(/\/$/, "");

export const metadata: Metadata = {
	title: "YariKuru（ヤリクル）| やりくり予算に特化したシンプルな予算管理アプリ",
	description:
		"YariKuru（ヤリクル）は、固定費を除外した「自分でコントロールできるやりくり予算」だけに集中できる予算管理アプリです。直感的な円グラフと過去のスナップショット機能で、日々のやりくりをスマートにサポートします。",
	keywords: [
		"YariKuru",
		"ヤリクル",
		"やりくり",
		"予算管理アプリ",
		"家計簿アプリ",
	],
	openGraph: {
		title:
			"YariKuru（ヤリクル）| やりくり予算に特化したシンプルな予算管理アプリ",
		description:
			"固定費のノイズを排除し、「今月あといくら使えるか」に特化。過去のやりくり設定も正確に振り返れます。",
		url: defaultUrl,
		siteName: "YariKuru",
		locale: "ja_JP",
		type: "website",
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "WebApplication",
	name: "YariKuru（ヤリクル）",
	alternateName: "YariKuru",
	url: defaultUrl,
	description:
		"固定費を除外した「自分でコントロールできるやりくり予算」だけに集中できる予算管理アプリ。直感的な円グラフと過去のスナップショット機能で、日々のやりくりをスマートにサポートします。",
	applicationCategory: "FinanceApplication",
	operatingSystem: "All",
	browserRequirements: "Requires JavaScript. Requires HTML5.",
	offers: {
		"@type": "Offer",
		price: "150",
		priceCurrency: "JPY",
	},
};

export default async function LandingPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// すでにログイン済みの場合はダッシュボードへ高速リダイレクト
	if (user) {
		redirect("/dashboard");
	}

	return (
		<>
			<script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
			<LandingPageClient />
		</>
	);
}
