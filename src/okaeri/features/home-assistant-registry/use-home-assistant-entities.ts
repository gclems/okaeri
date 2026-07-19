import { useQuery } from "@tanstack/react-query";

import { getHomeAssistantEntities } from "#/server/home-assistant-registry/home-assistant-registry-functions";

export const homeAssistantEntitiesQueryOptions = {
	queryKey: ["home-assistant-entities"],
	queryFn: async () => getHomeAssistantEntities(),
	staleTime: 5 * 60_000, // 5 minutes
};

export function useHomeAssistantEntities() {
	return useQuery(homeAssistantEntitiesQueryOptions);
}
