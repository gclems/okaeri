import { useQuery } from "@tanstack/react-query";

import { getHomeAssistantAreas } from "#/server/registry/registry-functions";

export const homeAssistantAreasQueryOptions = {
	queryKey: ["home-assistant-areas"],
	queryFn: async () => getHomeAssistantAreas(),
	staleTime: 5 * 60_000, // 5 minutes
};

export function useHomeAssistantAreas() {
	return useQuery(homeAssistantAreasQueryOptions);
}
