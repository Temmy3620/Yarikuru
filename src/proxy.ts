import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
	return await updateSession(request);
}

export const config = {
	matcher: [
		/*
		 * 次のパス以外のすべてのリクエストパスにマッチさせます:
		 * - _next/static (静的ファイル)
		 * - _next/image (画像最適化ファイル)
		 * - favicon.ico (ファビコンファイル)
		 * - robots.txt, sitemap.xml (SEO・クローラー用ファイル)
		 * - Google Search Console 所有権確認ファイル (google*.html)
		 * - 画像やアセットファイル (拡張子)
		 */
		"/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html)$).*)",
	],
};
