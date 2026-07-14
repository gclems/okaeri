import { useEffect } from "react";

import { animate, motion, useMotionValue, useTransform } from "motion/react";

function AnimatedNumber({
	number,
	formatter,
}: {
	number: number;
	formatter?: (value: number) => string;
}) {
	const animated = useMotionValue(number);

	const formatted = useTransform(() =>
		formatter ? formatter(animated.get()) : animated.get().toString(),
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: "animated" must not be a dependency
	useEffect(() => {
		const controls = animate(animated, number);
		return () => controls.stop();
	}, [number]);

	return <motion.span>{formatted}</motion.span>;
}

export { AnimatedNumber };
