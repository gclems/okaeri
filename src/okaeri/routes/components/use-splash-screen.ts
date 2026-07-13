// src/features/splashscreen/splashscreen-store.ts
import { useEffect, useState } from "react";

const TRANSITION_DURATION = 0.5;
const VISIBILITY_DURATION = 0.5;

export const useSplashscreen = () => {
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		if (!visible) return;

		const timeout = window.setTimeout(() => {
			setVisible(false);
		}, VISIBILITY_DURATION * 1000);

		return () => window.clearTimeout(timeout);
	}, [visible]);

	return {
		visible,
		transitionDuration: TRANSITION_DURATION,
		visibilityDuration: VISIBILITY_DURATION,
	};
};
