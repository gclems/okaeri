import { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

type RollingNumberProps = {
	number: number;
	formatter?: (value: number) => string;
	className?: string;
};

const digitVariants = {
	enter: (direction: number) => ({
		y: `${direction * 100}%`,
		rotateX: direction * -65,
		opacity: 0,
	}),
	center: { y: "0%", rotateX: 0, opacity: 1 },
	exit: (direction: number) => ({
		y: `${direction * -100}%`,
		rotateX: direction * 65,
		opacity: 0,
	}),
};

function RollingDigit({
	digit,
	direction,
}: {
	digit: string;
	direction: number;
}) {
	return (
		<span
			style={{
				display: "inline-grid",
				overflow: "hidden",
				perspective: "8em",
			}}
		>
			<AnimatePresence initial={false} custom={direction} mode="popLayout">
				<motion.span
					key={digit}
					custom={direction}
					variants={digitVariants}
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
					{digit}
				</motion.span>
			</AnimatePresence>
		</span>
	);
}

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
				display: "inline-flex",
				verticalAlign: "bottom",
			}}
		>
			<span style={{ display: "contents" }}>
				{Array.from(formattedNumber, (character, index) =>
					/\d/.test(character) ? (
						<RollingDigit
							// biome-ignore lint/suspicious/noArrayIndexKey: The index deliberately identifies a stable digit slot.
							key={index}
							digit={character}
							direction={direction}
						/>
					) : (
						// biome-ignore lint/suspicious/noArrayIndexKey: The index deliberately identifies a stable character slot.
						<span key={index}>{character}</span>
					),
				)}
			</span>
		</span>
	);
}

export { RollingNumber };
export type { RollingNumberProps };
