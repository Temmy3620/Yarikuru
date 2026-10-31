import { headers } from "next/headers";

/**
 * プロキシ環境（Cloud Run 等）およびローカル開発環境に対応した
 * アプリケーションのベースURLを取得する共通関数
 *
 * @param request 任意の Request オブジェクト（Route Handler などで使用）
 * @returns 例: "https://yarikuru.temmylabo.app" や "http://localhost:3005"
 */
export async function getBaseUrl(request?: Request): Promise<string> {
	// 環境変数が設定されている場合はそれを最優先で使用（http/https スキームの抜け漏れを自動補正）
	if (process.env.NEXT_PUBLIC_APP_URL) {
		let url = process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/$/, "");
		if (!url.startsWith("http://") && !url.startsWith("https://")) {
			url = `https://${url}`;
		}
		return url;
	}

	let host: string | null = null;
	let protocol: string | null = null;

	if (request) {
		const forwardedHost = request.headers.get("x-forwarded-host");
		const forwardedProto = request.headers.get("x-forwarded-proto");
		host = forwardedHost || new URL(request.url).host;
		protocol =
			forwardedProto || (host.includes("localhost") ? "http" : "https");
	} else {
		const headersList = await headers();
		const forwardedHost = headersList.get("x-forwarded-host");
		const forwardedProto = headersList.get("x-forwarded-proto");
		host = forwardedHost || headersList.get("host");
		protocol =
			forwardedProto || (host?.includes("localhost") ? "http" : "https");
	}

	if (!host) {
		return "http://localhost:3005";
	}

	return `${protocol}://${host}`;
}
