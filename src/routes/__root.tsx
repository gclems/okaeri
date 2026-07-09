import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	HeadContent,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { motion } from "motion/react";

import { AppProviders } from "#/okaeri/app/app-providers";
import { AppSidebar } from "#/okaeri/app/app-sidebar";
import { AppSplashscreen } from "#/okaeri/app/app-splashscreen";
import { AppTopBar } from "#/okaeri/app/app-top-bar";
import { useSplashscreen } from "#/okaeri/app/use-splash-screen";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

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
				title: "Okaeri",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const { transitionDuration, visibilityDuration } = useSplashscreen();
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body className="relative">
				<AppSplashscreen />
				<AppProviders>
					<motion.div
						className="w-screen h-screen flex"
						initial={{ opacity: 0, filter: "blur(8px)", translateY: "-5%" }}
						animate={{ opacity: 1, filter: "blur(0px)", translateY: "0%" }}
						transition={{ delay: visibilityDuration, duration: transitionDuration }}
					>
						<div className="w-fit h-full min-h-full max-h-full overflow-auto">
							<AppSidebar />
						</div>
						<main className="flex-1 h-full min-h-full max-h-full overflow-auto flex flex-col px-6 py-2">
							<AppTopBar />
							<div className="mt-8">{children}</div>
						</main>
					</motion.div>
				</AppProviders>
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
