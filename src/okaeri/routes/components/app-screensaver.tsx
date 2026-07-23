import { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import { RollingTime } from "@/components/rolling-time";
import { useClock } from "@/features/clock/use-clock";

const INACTIVITY_DELAY = 120_000;

function ScreensaverClock() {
	const now = useClock();

	return (
		<>
			<img src="/logo_image.png" alt="Logo" className="max-w-64 w-full" />
			<RollingTime
				date={now}
				className="text-[clamp(5rem,18vw,12rem)] leading-none text-foreground"
			/>
			<p className="text-heading text-xl text-muted-foreground sm:text-2xl">
				{now.toLocaleDateString("fr-FR", {
					weekday: "long",
					day: "numeric",
					month: "long",
				})}
			</p>
		</>
	);
}

function AppScreensaver() {
	const [visible, setVisible] = useState(false);
	const timeoutRef = useRef<number>(undefined);
	const visibleRef = useRef(false);

	useEffect(() => {
		visibleRef.current = visible;
	}, [visible]);

	useEffect(() => {
		const scheduleScreensaver = () => {
			window.clearTimeout(timeoutRef.current);
			timeoutRef.current = window.setTimeout(() => {
				visibleRef.current = true;
				setVisible(true);
			}, INACTIVITY_DELAY);
		};

		const handleActivity = (event: Event) => {
			if (visibleRef.current) {
				if (event.type === "pointerdown") {
					visibleRef.current = false;
					setVisible(false);
					scheduleScreensaver();
				}
				return;
			}

			scheduleScreensaver();
		};

		const events = ["pointermove", "pointerdown", "keydown", "scroll"];

		for (const event of events) {
			window.addEventListener(event, handleActivity, { capture: true });
		}
		scheduleScreensaver();

		return () => {
			window.clearTimeout(timeoutRef.current);
			for (const event of events) {
				window.removeEventListener(event, handleActivity, { capture: true });
			}
		};
	}, []);

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					aria-label="Écran de veille. Cliquez pour revenir à l’application."
					className="fixed inset-0 z-99999 flex cursor-pointer select-none flex-col items-center justify-center gap-5 bg-background"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.4 }}
				>
					<ScreensaverClock />
					<p className="absolute bottom-10 text-sm text-muted-foreground/70">
						Cliquez pour continuer
					</p>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export { AppScreensaver };
