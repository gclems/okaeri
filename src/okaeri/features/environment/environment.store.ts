import type { DomoEnvironmentSnapshot } from "#/shared/environment-types";
import { useDomoStore } from "@/features/domo-store";

const emptySnapshot: DomoEnvironmentSnapshot = {
	sensors: {},
	revision: 0,
};

export const useEnvironmentStore = () =>
	useDomoStore(
		(state) =>
			(state.snapshots.environment as DomoEnvironmentSnapshot | undefined) ??
			emptySnapshot,
	);
