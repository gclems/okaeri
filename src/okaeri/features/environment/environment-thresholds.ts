export type ThresholdLevel =
	| "critical_low"
	| "warning_low"
	| "normal"
	| "warning_high"
	| "critical_high";

export type Threshold = {
	min?: number;
	max?: number;
	level: ThresholdLevel;
};

export const INTERIOR_TEMPERATURE_THRESHOLDS: Threshold[] = [];

export const INTERIOR_HUMIDITY_THRESHOLDS: Threshold[] = [
	{ max: 35, level: "critical_low" },
	{ min: 35, max: 40, level: "warning_low" },
	{ min: 40, max: 60, level: "normal" },
	{ min: 60, max: 70, level: "warning_high" },
	{ min: 70, level: "critical_high" },
];
