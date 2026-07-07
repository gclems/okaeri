import { useEffect, useMemo, useState } from "react";

import type { DomoSun, DomoSunPhase } from "#/domo/sun/sun.types";

import { type OkaeriTheme, applyTheme } from "./theme";

const themeFromSunPhase = {
	morning: "morning",
	day: "day",
	evening: "evening",
	night: "night",
} satisfies Record<DomoSunPhase, OkaeriTheme>;

export function useTheme() {
	// const sun = useHaStore((state) => state.entities["sun.sun"]);
	const sun: DomoSun = useMemo(
		() => ({
			date: new Date().toISOString(),

			sunrise: new Date(new Date().setHours(6, 0, 0, 0)).toISOString(),
			noon: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
			sunset: new Date(new Date().setHours(18, 0, 0, 0)).toISOString(),

			nextSunrise: new Date(
				new Date(new Date().setDate(new Date().getDate() + 1)).setHours(6, 0, 0, 0),
			).toISOString(),
			nextNoon: new Date(
				new Date(new Date().setDate(new Date().getDate() + 1)).setHours(
					12,
					0,
					0,
					0,
				),
			).toISOString(),
			nextSunset: new Date(
				new Date(new Date().setDate(new Date().getDate() + 1)).setHours(
					18,
					0,
					0,
					0,
				),
			).toISOString(),

			horizonState: "above_horizon",
			rising: true,

			phase: "evening",
		}),
		[],
	);
	const [theme, setTheme] = useState<OkaeriTheme>("day");

	useEffect(() => {
		if (!sun) return;

		const nextTheme = themeFromSunPhase[sun.phase as DomoSunPhase] ?? "day";

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
