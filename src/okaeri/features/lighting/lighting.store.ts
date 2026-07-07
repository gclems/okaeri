// app/okaeri/features/lighting/stores/lighting.store.ts

import { create } from "zustand";

import type { DomoLightBulb, DomoLightGroup } from "#/domo";

type LightingState = {
	bulbs: Record<string, DomoLightBulb>;
	groups: Record<string, DomoLightGroup>;
	upsertLightBulb: (bulb: DomoLightBulb) => void;
	upsertLightGroup: (group: DomoLightGroup) => void;
};

export const useLightingStore = create<LightingState>((set) => ({
	bulbs: {},
	groups: {},

	upsertLightBulb: (bulb) => {
		set((state) => ({
			bulbs: {
				...state.bulbs,
				[bulb.entityId]: bulb,
			},
		}));
	},
	upsertLightGroup: (group) => {
		set((state) => ({
			groups: {
				...state.groups,
				[group.entityId]: group,
			},
		}));
	},
}));
