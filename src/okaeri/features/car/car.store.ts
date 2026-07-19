import type { DomoCarSnapshot } from "#/shared/car-types";
import { useDomoStore } from "@/features/domo-store";

const emptySnapshot: DomoCarSnapshot = {
	revision: 0,
	car: null,
	carSetting: null,
};

export const useCarStore = () =>
	useDomoStore(
		(state) =>
			(state.snapshots.car as DomoCarSnapshot | undefined) ?? emptySnapshot,
	);
