import { createFileRoute } from "@tanstack/react-router";
import { Alert } from "shanty-ui";

import { loadRooms } from "#/domo/server/architect/room-functions";
import type { Room } from "#/domo/shared/architect/architect-types";
import { ResetButton } from "#/okaeri/features/architect/reset-button";
import { RoomProperties } from "#/okaeri/features/architect/room-properties";
import { RoomsCanvas } from "#/okaeri/features/architect/rooms-canvas";
import { SubmitButton } from "#/okaeri/features/architect/submit-button";
import { HomeArchitectProvider } from "#/okaeri/features/architect/use-home-architect";

export const Route = createFileRoute("/settings/home-architect")({
	loader: async () => loadRooms(),
	component: RouteComponent,
});

function RouteComponent() {
	const defaultRooms: Room[] = Route.useLoaderData();

	return (
		<HomeArchitectProvider defaultRooms={defaultRooms}>
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
	);
}
