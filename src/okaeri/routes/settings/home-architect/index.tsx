import { createFileRoute } from "@tanstack/react-router";
import { Alert } from "shanty-ui";

import { QueryLoader } from "@/components/query-loader";
import { roomsQueryOptions, useRooms } from "@/features/architect/use-rooms";
import {
	homeAssistantAreasQueryOptions,
	useHomeAssistantAreas,
} from "@/features/registry/use-home-assistant-areas";
import { ResetButton } from "@/routes/settings/home-architect/components/reset-button";
import { RoomProperties } from "@/routes/settings/home-architect/components/room-properties";
import { RoomsCanvas } from "@/routes/settings/home-architect/components/rooms-canvas";
import { SubmitButton } from "@/routes/settings/home-architect/components/submit-button";
import { HomeArchitectProvider } from "@/routes/settings/home-architect/components/use-home-architect";

export const Route = createFileRoute("/settings/home-architect/")({
	loader: ({ context }) =>
		Promise.all([
			context.queryClient.ensureQueryData(roomsQueryOptions),
			context.queryClient.ensureQueryData(homeAssistantAreasQueryOptions),
		]),
	component: RouteComponent,
});

function RouteComponent() {
	const roomsQuery = useRooms();
	const haAreasQuery = useHomeAssistantAreas();

	return (
		<QueryLoader queries={[haAreasQuery, roomsQuery]}>
			{([areas, rooms]) => (
				<HomeArchitectProvider defaultRooms={rooms} haAreas={areas}>
					<div className="space-y-6 @container">
						<Alert className="@5xl:hidden" color="warning-discrete">
							Cette page n'est pas responsive
						</Alert>

						<div className="flex items-stretch aspect-video gap-x-4">
							{/* <RoomsList /> */}
							<RoomsCanvas />
							<RoomProperties />
						</div>
						<div className="flex items-center justify-between">
							<ResetButton />
							<SubmitButton />
						</div>
					</div>
				</HomeArchitectProvider>
			)}
		</QueryLoader>
	);
}
