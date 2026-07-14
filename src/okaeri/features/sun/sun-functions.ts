import type { DaylySun } from "#/shared/sun-types";

export type SunPhase = "day" | "night" | "sunrise" | "sunset";

export function getSunPhase(sun: DaylySun): SunPhase {
	const now = new Date();

	if (now < sun.sunrise_at) {
		return "night";
	}

	const minutesAfterSunrise =
		(now.getTime() - sun.sunrise_at.getTime()) / (1000 * 60);
	if (minutesAfterSunrise < 120) {
		return "sunrise";
	}

	if (now < sun.sunset_at) {
		return "day";
	}

	const minutesAfterSunset =
		(now.getTime() - sun.sunset_at.getTime()) / (1000 * 60);
	if (minutesAfterSunset < 45) {
		return "sunset";
	}

	return "night";
}
