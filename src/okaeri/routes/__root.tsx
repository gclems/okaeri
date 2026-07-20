import type { QueryClient } from "@tanstack/react-query";
import {
	HeadContent,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";

import { AppLayout } from "@/routes/components/app-layout";
import { AppSplashscreen } from "@/routes/components/app-splashscreen";

import appCss from "../styles.css?url";

import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/manrope";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: import.meta.env.DEV ? "Okaeri (DEV)" : "Okaeri",
			},
			{
				name: "theme-color",
				content: "#000000",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/icons/favicon-32x32.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "16x16",
				href: "/icons/favicon-16x16.png",
			},
			{
				rel: "icon",
				type: "image/x-icon",
				href: "/icons/favicon.ico",
			},
			{
				rel: "manifest",
				href: "/manifest.json",
			},
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/icons/apple-icon-180x180.png",
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="fr">
			<head>
				<HeadContent />
			</head>
			<body className="relative">
				<AppLayout>{children}</AppLayout>
				<AppSplashscreen />
				<Scripts />
			</body>
		</html>
	);
}
