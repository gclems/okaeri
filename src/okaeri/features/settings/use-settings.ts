import { queryOptions, useQuery } from "@tanstack/react-query";

import {
	findSetting,
	loadSettings,
} from "#/server/settings/settings-functions";

export const settingsQueryOptions = queryOptions({
	queryKey: ["domo", "settings"],
	queryFn: () => loadSettings(),

	// Appropriate if this DB is only modified through Okaeri.
	staleTime: Infinity,
});

export const settingsByKeyQueryOptions = (key: string) =>
	queryOptions({
		queryKey: ["domo", "settings", key],
		queryFn: () => findSetting({ data: { key } }),
		// Appropriate if this DB is only modified through Okaeri.
		staleTime: Infinity,
	});

export function useSettings() {
	return useQuery(settingsQueryOptions);
}

export function useFindSettings(key: string) {
	return useQuery(settingsByKeyQueryOptions(key));
}
