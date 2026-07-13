// app/okaeri/features/lighting/stores/lighting.store.ts

import { create } from "zustand";

import type { DomoSun } from "#/_old_/sun";

export const useSunStore = create<DomoSun | null>(() => ({
	date: new Date().toISOString(),

	sunrise: new Date(new Date().setHours(6, 23, 10, 0)).toISOString(),
	noon: new Date(new Date().setHours(13, 56, 2, 0)).toISOString(),
	sunset: new Date(new Date().setHours(21, 7, 0, 0)).toISOString(),

	nextSunrise: new Date(
		new Date(new Date().setDate(new Date().getDate() + 1)).setHours(6, 23, 10, 0),
	).toISOString(),
	nextNoon: new Date(
		new Date(new Date().setDate(new Date().getDate() + 1)).setHours(13, 56, 2, 0),
	).toISOString(),
	nextSunset: new Date(
		new Date(new Date().setDate(new Date().getDate() + 1)).setHours(21, 7, 0, 0),
	).toISOString(),

	horizonState: "above_horizon",
	rising: true,

	phase: "morning",
}));
