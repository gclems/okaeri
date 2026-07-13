import { cn } from "shanty-ui";

import type { Room } from "#/shared/architect/architect-types";
import { QueryLoader } from "@/components/query-loader";
import { useRooms } from "@/features/architect/use-rooms";
import { useLightBulbs } from "@/features/lighting/use-light-bulbs";

const GRID_SIZE = 32;
const GRID_COLUMNS = 32;
const GRID_ROWS = 32;

function HomeBlueprints() {
	const roomsQuery = useRooms();

	const width = GRID_COLUMNS * GRID_SIZE;
	const height = GRID_ROWS * GRID_SIZE;

	return (
		<div className="relative h-full w-full overflow-hidden">
			<QueryLoader queries={[roomsQuery]}>
				{([rooms]) => (
					<div className="h-full w-full overflow-auto flex-1 relative">
						<div
							className="relative mx-auto overflow-hidden rounded-md bg-background shadow-sm"
							style={{
								width,
								height,
							}}
						>
							{Object.values(rooms).map((room) => (
								<RoomDrawing key={room.id} room={room} />
							))}
						</div>
					</div>
				)}
			</QueryLoader>
		</div>
	);
}

function RoomDrawing({ room }: { room: Room }) {
	const lightBulbs = useLightBulbs();

	// const roomLightBulbs = Object.values(lightBulbs).filter(
	// 	(lightBulb) => lightBulb.roomId === room.id,
	// );

	return (
		<div>
			<button
				type="button"
				onClick={() => alert("clicli")}
				className={cn(
					"cursor-pointer",
					"relative flex h-full w-full flex-col items-center justify-center",
					"overflow-hidden border px-2",
					"text-center transition-colors",
					"hover:bg-primary/15",
					"hover:border-3",
					"border-foreground/50",
				)}
				style={{
					backgroundColor:
						room.color ?? "color-mix(in oklab, var(--secondary) 15%, transparent)",
					borderTopStyle: room.walls.top ? "solid" : "dotted",
					borderLeftStyle: room.walls.left ? "solid" : "dotted",
					borderRightStyle: room.walls.right ? "solid" : "dotted",
					borderBottomStyle: room.walls.bottom ? "solid" : "dotted",
					position: "absolute",
					top: room.layout.y * GRID_SIZE,
					left: room.layout.x * GRID_SIZE,
					width: room.layout.width * GRID_SIZE,
					height: room.layout.height * GRID_SIZE,
				}}
			>
				<span className="font-medium">{room.name}</span>
			</button>
		</div>
	);
}

export { HomeBlueprints };
