import { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

type RollingNumberProps = {
	number: number;
	formatter?: (value: number) => string;
	className?: string;
};

function RollingNumber({ number, formatter, className }: RollingNumberProps) {
	const [displayedNumber, setDisplayedNumber] = useState(number);
	const [direction, setDirection] = useState(1);
	const displayedNumberRef = useRef(number);

	useEffect(() => {
		const current = displayedNumberRef.current;

		if (current !== number) {
			setDirection(number > current ? 1 : -1);
			displayedNumberRef.current = number;
			setDisplayedNumber(number);
		}
	}, [number]);

	const formattedNumber = formatter
		? formatter(displayedNumber)
		: displayedNumber.toString();

	return (
		<span
			className={className}
			style={{
				display: "inline-grid",
				overflow: "hidden",
				perspective: "8em",
				verticalAlign: "bottom",
			}}
		>
			<AnimatePresence initial={false} custom={direction} mode="popLayout">
				<motion.span
					key={displayedNumber}
					custom={direction}
					variants={{
						enter: (rollDirection: number) => ({
							y: `${rollDirection * 100}%`,
							rotateX: rollDirection * -65,
							opacity: 0,
						}),
						center: { y: "0%", rotateX: 0, opacity: 1 },
						exit: (rollDirection: number) => ({
							y: `${rollDirection * -100}%`,
							rotateX: rollDirection * 65,
							opacity: 0,
						}),
					}}
					initial="enter"
					animate="center"
					exit="exit"
					transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
					style={{
						backfaceVisibility: "hidden",
						gridArea: "1 / 1",
						transformOrigin: "center center",
					}}
				>
					{formattedNumber}
				</motion.span>
			</AnimatePresence>
		</span>
	);
}

export { RollingNumber };
export type { RollingNumberProps };
