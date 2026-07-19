import type { DomoSun } from "#/interfaces/sun";

export type SunPhase = "day" | "night" | "sunrise" | "sunset";

export function getSunPhase(sun: DomoSun): SunPhase {
	const now = new Date();

	if (now < sun.sunriseAt) {
		return "night";
	}

	const minutesAfterSunrise =
		(now.getTime() - sun.sunriseAt.getTime()) / (1000 * 60);
	if (minutesAfterSunrise < 120) {
		return "sunrise";
	}

	if (now < sun.sunsetAt) {
		return "day";
	}

	const minutesAfterSunset =
		(now.getTime() - sun.sunsetAt.getTime()) / (1000 * 60);
	if (minutesAfterSunset < 45) {
		return "sunset";
	}

	return "night";
}
