// features/architect/use-rooms.ts

import { queryOptions, useQuery } from "@tanstack/react-query";

import { loadRooms } from "#/server/architect/room-functions";

export const roomsQueryOptions = queryOptions({
	queryKey: ["domo", "rooms"],
	queryFn: () => loadRooms(),

	// Appropriate if this DB is only modified through Okaeri.
	staleTime: Infinity,
});

export function useRooms() {
	return useQuery(roomsQueryOptions);
}
