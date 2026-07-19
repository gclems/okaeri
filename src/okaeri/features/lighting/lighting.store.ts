import type { DomoLightingSnapshot } from "#/server/lighting/lighting-service";
import { useDomoStore } from "@/features/domo-store";

const emptySnapshot: DomoLightingSnapshot = {
	revision: 0,
	lights: {},
	lightGroups: {},
};

export const useLightingStore = () =>
	useDomoStore(
		(state) =>
			(state.snapshots.lighting as DomoLightingSnapshot | undefined) ??
			emptySnapshot,
	);
