import { createFileRoute } from "@tanstack/react-router";
import { Alert } from "shanty-ui";

import { QueryLoader } from "@/components/query-loader";
import { roomsQueryOptions, useRooms } from "@/features/architect/use-rooms";
import {
	homeAssistantAreasQueryOptions,
	useHomeAssistantAreas,
} from "@/features/home-assistant-registry/use-home-assistant-area";
import {
	homeAssistantDevicesQueryOptions,
	useHomeAssistantDevices,
} from "@/features/home-assistant-registry/use-home-assistant-devices";
import { ResetButton } from "@/routes/home-architect/components/reset-button";
import { RoomProperties } from "@/routes/home-architect/components/room-properties";
import { RoomsCanvas } from "@/routes/home-architect/components/rooms-canvas";
import { SubmitButton } from "@/routes/home-architect/components/submit-button";
import { HomeArchitectProvider } from "@/routes/home-architect/components/use-home-architect";

export const Route = createFileRoute("/home-architect/")({
	loader: ({ context }) =>
		Promise.all([
			context.queryClient.ensureQueryData(roomsQueryOptions),
			context.queryClient.ensureQueryData(homeAssistantAreasQueryOptions),
			context.queryClient.ensureQueryData(homeAssistantDevicesQueryOptions),
		]),
	component: RouteComponent,
});

function RouteComponent() {
	const roomsQuery = useRooms();
	const haAreasQuery = useHomeAssistantAreas();
	const haDevicesQuery = useHomeAssistantDevices();

	return (
		<QueryLoader queries={[haAreasQuery, haDevicesQuery, roomsQuery]}>
			{([areas, devices, rooms]) => (
				<HomeArchitectProvider
					defaultRooms={rooms}
					haAreas={areas}
					haDevices={devices}
				>
					<div className="space-y-6 @container">
						<Alert className="@5xl:hidden" color="warning-discrete">
							Cette page n'est pas responsive
						</Alert>

						<div className="flex items-stretch aspect-video gap-x-4">
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
