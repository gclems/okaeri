import { AnimatePresence, motion } from "motion/react";

import { useDomoStore } from "@/features/domo-store";

import { AppProviders } from "./app-providers";
import { AppSidebar } from "./app-sidebar";
import { AppTopBar } from "./app-top-bar";

function AppLayout({ children }: { children: React.ReactNode }) {
	const domo = useDomoStore();
	return (
		<AppProviders>
			<AnimatePresence>
				{domo.connectionState === "connected" && (
					<motion.div
						className="w-screen h-screen flex relative"
						initial={{ filter: "blur(10px)" }}
						animate={{ filter: "blur(0px)" }}
					>
						<div className="w-fit h-full min-h-full max-h-full overflow-auto">
							<AppSidebar />
						</div>
						<main className="flex-1 h-full min-h-full max-h-full overflow-auto flex flex-col px-6 py-2">
							<AppTopBar />
							<div className="mt-8">{children}</div>
						</main>
					</motion.div>
				)}
			</AnimatePresence>
		</AppProviders>
	);
}

export { AppLayout };
