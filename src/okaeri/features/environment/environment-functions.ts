import type { ThresholdLevel } from "@/features/environment/environment-thresholds";
import {
	INTERIOR_HUMIDITY_THRESHOLDS,
	INTERIOR_TEMPERATURE_THRESHOLDS,
} from "@/features/environment/environment-thresholds";

const THRESHOLD_BINDINGS = {
	interior_temperature: INTERIOR_TEMPERATURE_THRESHOLDS,
	interior_humidity: INTERIOR_HUMIDITY_THRESHOLDS,
};

export const getThresholdLevel = (
	type: "interior_temperature" | "interior_humidity",
	value: number,
): ThresholdLevel => {
	const thresholds = THRESHOLD_BINDINGS[type];
	for (const threshold of thresholds) {
		if (
			(threshold.min === undefined || value >= threshold.min) &&
			(threshold.max === undefined || value <= threshold.max)
		) {
			return threshold.level;
		}
	}

	return "normal";
};
