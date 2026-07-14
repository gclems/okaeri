import { useEffect, useState } from "react";

// import type { DomoSunPhase } from "#/_old_/sun";
// import type { DomoSunPhase } from "#/_old_/sun/sun.types";

import type { SunPhase } from "@/features/sun/sun-functions";
import { useSun } from "@/features/sun/use-sun";
import { useSunPhase } from "@/features/sun/use-sun-phase";

import { type OkaeriTheme, applyTheme } from "./theme";

const themeFromSunPhase = {
	sunrise: "morning",
	day: "day",
	sunset: "evening",
	night: "night",
} satisfies Record<SunPhase, OkaeriTheme>;

export function useTheme() {
	const sunQuery = useSun();
	const sunPhase = useSunPhase(sunQuery.data);

	const [theme, setTheme] = useState<OkaeriTheme>("morning");

	useEffect(() => {
		const nextTheme = themeFromSunPhase[sunPhase as SunPhase] ?? "day";
		setTheme(nextTheme);
		applyTheme(nextTheme);
	}, [sunPhase]);

	return {
		theme,
		setTheme: (theme: OkaeriTheme) => {
			setTheme(theme);
			applyTheme(theme);
		},
	};
}
