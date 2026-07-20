import { AnimatePresence, motion } from "motion/react";
import { Button } from "shanty-ui";

import { restartDomo } from "#/server/domo-functions";
import { useDomoStore } from "@/features/domo-store";

function AppSplashscreen() {
	const domo = useDomoStore();

	const visible = domo.connectionState !== "connected";

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					className="fixed inset-0 z-99999 flex items-center justify-center bg-background flex-col gap-8"
					initial={{ opacity: 1 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
					transition={{ duration: 0.5, ease: "backOut" }}
				>
					<img src="/logo_image.png" alt="Logo" className="max-w-64 w-full" />
					<img src="/logo_title_both.png" alt="Logo" className="max-w-72" />
					<div>Dōmo Server: {domo.connectionState}</div>
					{domo.connectionState === "error" && (
						<Button onClick={() => restartDomo()}>Restart server</Button>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export { AppSplashscreen };
