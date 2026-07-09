import { PlusIcon } from "lucide-react";
import { Rnd } from "react-rnd";
import { Button, cn } from "shanty-ui";

import type { Room } from "#/domo/shared/architect/architect-types";

import { useHomeArchitect } from "./use-home-architect";

const GRID_SIZE = 32;
const GRID_COLUMNS = 32;
const GRID_ROWS = 32;

function RoomsCanvas() {
	const width = GRID_COLUMNS * GRID_SIZE;
	const height = GRID_ROWS * GRID_SIZE;

	const { addRoom, rooms, selectRoom } = useHomeArchitect();

	return (
		<div className="relative h-full w-full overflow-hidden">
			<div className="h-full w-full overflow-auto border-border border rounded-md flex-1 relative">
				<div
					className="relative mx-auto overflow-hidden rounded-md bg-background shadow-sm"
					style={{
						width,
						height,
						backgroundImage: `
						linear-gradient(to right, var(--border) 1px, transparent 1px),
						linear-gradient(to bottom, var(--border) 1px, transparent 1px)
					`,
						backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
					}}
					onPointerDown={(event) => {
						if (event.target === event.currentTarget) {
							selectRoom(null);
						}
					}}
				>
					{Object.values(rooms).map((room) => (
						<RoomDrawing key={room.id} room={room} />
					))}
				</div>
			</div>

			<Button
				className="absolute top-4 right-4 rounded-full size-12"
				square
				size="lg"
				color="secondary"
				onClick={() => {
					const id = crypto.randomUUID();
					addRoom({
						id,
						name: `Pièce ${Object.keys(rooms).length + 1}`,
						haAreaId: null,
						color: "rgba(137, 197, 215, 0.2)",
						layout: {
							x: 0,
							y: 0,
							width: 5,
							height: 5,
						},
						walls: {
							top: true,
							right: true,
							bottom: true,
							left: true,
						},
					});

					selectRoom(id);
				}}
			>
				<PlusIcon />
			</Button>
		</div>
	);
}

function RoomDrawing({ room }: { room: Room }) {
	const { selectedRoom, selectRoom, updateRoom } = useHomeArchitect();
	const selected = selectedRoom?.id === room.id;

	const handleSelect = () => {
		selectRoom(room.id);
	};

	return (
		<Rnd
			bounds="parent"
			position={{
				x: room.layout.x * GRID_SIZE,
				y: room.layout.y * GRID_SIZE,
			}}
			size={{
				width: room.layout.width * GRID_SIZE,
				height: room.layout.height * GRID_SIZE,
			}}
			dragGrid={[GRID_SIZE, GRID_SIZE]}
			resizeGrid={[GRID_SIZE, GRID_SIZE]}
			minWidth={GRID_SIZE * 2}
			minHeight={GRID_SIZE * 2}
			enableResizing={selected}
			onMouseDown={handleSelect}
			onTouchStart={handleSelect}
			onDragStart={handleSelect}
			onResizeStart={handleSelect}
			onDragStop={(_, data) => {
				updateRoom(room.id, {
					layout: {
						x: Math.round(data.x / GRID_SIZE),
						y: Math.round(data.y / GRID_SIZE),
						width: room.layout.width,
						height: room.layout.height,
					},
				});
			}}
			onResizeStop={(_, __, element, ___, position) => {
				updateRoom(room.id, {
					layout: {
						x: Math.round(position.x / GRID_SIZE),
						y: Math.round(position.y / GRID_SIZE),
						width: Math.round(element.offsetWidth / GRID_SIZE),
						height: Math.round(element.offsetHeight / GRID_SIZE),
					},
				});
			}}
			className="group"
		>
			<button
				type="button"
				onClick={handleSelect}
				data-selected={selected}
				className={cn(
					"cursor-grab",
					"relative flex h-full w-full flex-col items-center justify-center",
					"overflow-hidden border px-2",
					"text-center transition-colors",
					"hover:bg-primary/15",
					"hover:border-3",
					"data-[selected=true]:border-primary",
					"data-[selected=true]:border-4",
					"data-[selected=false]:border-foreground/50",
				)}
				style={{
					backgroundColor:
						room.color ?? "color-mix(in oklab, var(--secondary) 15%, transparent)",
					borderTopStyle: room.walls.top ? "solid" : "dotted",
					borderLeftStyle: room.walls.left ? "solid" : "dotted",
					borderRightStyle: room.walls.right ? "solid" : "dotted",
					borderBottomStyle: room.walls.bottom ? "solid" : "dotted",
				}}
			>
				<span className="font-medium">{room.name}</span>

				{room.haAreaId ? (
					<span className="mt-1 text-xs text-muted-foreground text-metric">HA</span>
				) : (
					<span className="mt-1 text-xs text-warning text-metric">Non HA</span>
				)}

				{selected && (
					<span className="pointer-events-none absolute bottom-1 right-1 text-xs text-muted-foreground text-metric">
						{room.layout.width} x {room.layout.height}
					</span>
				)}
			</button>
		</Rnd>
	);
}

export { RoomsCanvas };
