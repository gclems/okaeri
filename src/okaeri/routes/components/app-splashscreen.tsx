import { AnimatePresence, motion } from "motion/react";

import { useSplashscreen } from "./use-splash-screen";

function AppSplashscreen() {
	const { visible, transitionDuration } = useSplashscreen();

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					className="fixed inset-0 z-99999 flex items-center justify-center bg-background flex-col gap-8"
					initial={{ opacity: 1 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
					transition={{ duration: transitionDuration, ease: "backOut" }}
				>
					<motion.img src="/logo_image.png" alt="Logo" className="max-w-64 w-full" />
					<motion.img src="/logo_title_both.png" alt="Logo" className="max-w-72" />
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export { AppSplashscreen };
