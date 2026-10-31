import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = (
		process.env.NEXT_PUBLIC_APP_URL || "https://yarikuru.temmylabo.app"
	)
		.trim()
		.replace(/\/$/, "");

	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: [
				"/dashboard",
				"/expenses",
				"/budgets",
				"/history",
				"/settings",
				"/api/",
				"/auth/",
				"/reset-password",
				"/forgot-password",
				"/onboarding",
			],
		},
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
