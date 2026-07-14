import { useEffect, useMemo, useState } from "react";

import type { DomoSunPhase } from "#/_old_/sun";

// import type { DomoSunPhase } from "#/_old_/sun";
// import type { DomoSunPhase } from "#/_old_/sun/sun.types";

import { type OkaeriTheme, applyTheme } from "./theme";

const themeFromSunPhase = {
	morning: "morning",
	day: "day",
	evening: "evening",
	night: "night",
} satisfies Record<DomoSunPhase, OkaeriTheme>;

export function useTheme() {
	//  const sun = useSunStore();
	const sun = useMemo(
		() => ({
			sunrise: new Date("2024-06-21T05:30:00"),
			noon: new Date("2024-06-21T12:00:00"),
			sunset: new Date("2024-06-21T20:30:00"),
			phase: "morning",
		}),
		[],
	);

	const [theme, setTheme] = useState<OkaeriTheme>("morning");

	useEffect(() => {
		const nextTheme = themeFromSunPhase[sun?.phase as DomoSunPhase] ?? "day";
		setTheme(nextTheme);
		applyTheme(nextTheme);
	}, [sun]);

	return {
		theme,
		setTheme: (theme: OkaeriTheme) => {
			setTheme(theme);
			applyTheme(theme);
		},
	};
}
