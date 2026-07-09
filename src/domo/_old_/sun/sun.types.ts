export type DomoSunPhase = "night" | "morning" | "day" | "evening";

export type DomoSun = {
	date: string;

	sunrise: string | null;
	noon: string | null;
	sunset: string | null;

	nextSunrise: string;
	nextNoon: string;
	nextSunset: string;

	horizonState: "above_horizon" | "below_horizon";
	rising: boolean;

	phase: DomoSunPhase;
};
