import { useQuery } from "@tanstack/react-query";

import { getHomeAssistantDevices } from "#/server/home-assistant-registry/home-assistant-registry-functions";

export const homeAssistantDevicesQueryOptions = {
	queryKey: ["home-assistant-devices"],
	queryFn: async () => getHomeAssistantDevices(),
	staleTime: 5 * 60_000, // 5 minutes
};

export function useHomeAssistantDevices() {
	return useQuery(homeAssistantDevicesQueryOptions);
}
