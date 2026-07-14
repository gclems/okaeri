import { queryOptions, useQuery } from "@tanstack/react-query";

import { loadSun } from "#/server/sun/sun-functions";

export const sunQueryOptions = queryOptions({
	queryKey: ["domo", "sun"],
	queryFn: () => loadSun(),
	refetchInterval: (query) => {
		const date = query.state.data?.date;

		if (!date) {
			return false;
		}
		date.setHours(0, 0, 0, 0);
		const tomorrow = new Date(date);
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(0, 5, 0, 0); // we refresh 5 minutes after midnight to avoid domo refresh issues

		return Math.max(tomorrow.getTime() - Date.now(), 0);
	},
});

export function useSun() {
	return useQuery(sunQueryOptions);
}
