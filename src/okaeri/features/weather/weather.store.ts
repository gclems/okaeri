import type { DomoWeatherSnapshot } from "#/interfaces/weather";
import { useDomoStore } from "@/features/domo-store";

const emptySnapshot: DomoWeatherSnapshot = {
	weatherDeviceSetting: null,
	weather: null,
	revision: 0,
};

export const useWeatherStore = () =>
	useDomoStore(
		(state) =>
			(state.snapshots.weather as DomoWeatherSnapshot | undefined) ??
			emptySnapshot,
	);
