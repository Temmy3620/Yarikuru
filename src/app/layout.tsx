import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	metadataBase: new URL("https://yarikuru.com"),
	title: "YariKuru（ヤリクル）",
	description: "予算の管理と可視化を行う Next.js アプリケーション",
	icons: {
		icon: "/icon_v6.png",
		apple: "/icon_v6.png",
	},
	appleWebApp: {
		capable: true,
		statusBarStyle: "black",
		title: "YariKuru",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="ja"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col bg-[#030616] text-white selection:bg-violet-500/30">
				{children}
			</body>
			<GoogleAnalytics gaId="G-KY9BFN6Y1N" />
		</html>
	);
}
