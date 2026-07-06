import { useQuery } from "@tanstack/react-query";

import { getLightGroups } from "#/server/functions/lighting.functions";

export function useLightGroups() {
	return useQuery({
		queryKey: ["light-groups"],
		queryFn: () => getLightGroups(),
		refetchInterval: 10_000,
	});
}
