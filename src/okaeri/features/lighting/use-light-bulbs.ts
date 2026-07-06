import { useQuery } from "@tanstack/react-query";

import { getLightBulbs } from "#/server/functions/lighting.functions";

export function useLightBulbs() {
	return useQuery({
		queryKey: ["lights"],
		queryFn: () => getLightBulbs(),
		refetchInterval: 10_000,
	});
}
