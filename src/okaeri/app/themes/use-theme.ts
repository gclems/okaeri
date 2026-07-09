import { useEffect, useState } from "react";

// import type { DomoSunPhase } from "#/domo/_old_/sun";
// import type { DomoSunPhase } from "#/domo/_old_/sun/sun.types";
import { useSunStore } from "#/okaeri/features/sun/sun.store";

import { type OkaeriTheme, applyTheme } from "./theme";

// const themeFromSunPhase = {
// 	morning: "morning",
// 	day: "day",
// 	evening: "evening",
// 	night: "night",
// } satisfies Record<DomoSunPhase, OkaeriTheme>;

export function useTheme() {
	const sun = useSunStore();
	const [theme, setTheme] = useState<OkaeriTheme>("morning");

	useEffect(() => {
		// const nextTheme = themeFromSunPhase[sun?.phase as DomoSunPhase] ?? "day";
		const nextTheme = "morning";
		setTheme(nextTheme);
		applyTheme(nextTheme);
	}, []);

	return {
		theme,
		setTheme: (theme: OkaeriTheme) => {
			setTheme(theme);
			applyTheme(theme);
		},
	};
}
