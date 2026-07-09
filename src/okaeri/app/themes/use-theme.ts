import { useEffect, useState } from "react";

import type { DomoSunPhase } from "#/domo/sun/sun.types";
import { useSunStore } from "#/okaeri/features/sun/sun.store";

import { type OkaeriTheme, applyTheme } from "./theme";

const themeFromSunPhase = {
	morning: "morning",
	day: "day",
	evening: "evening",
	night: "night",
} satisfies Record<DomoSunPhase, OkaeriTheme>;

export function useTheme() {
	const sun = useSunStore();
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
