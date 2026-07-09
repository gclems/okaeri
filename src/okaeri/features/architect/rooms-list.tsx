import { PlusIcon } from "lucide-react";
import { Button, Card, cn } from "shanty-ui";

import { useHomeArchitect } from "./use-home-architect";

function RoomsList() {
	const { rooms, selectedRoom, selectRoom, addRoom } = useHomeArchitect();

	return (
		<Card className="w-40">
			<Card.Header title="Pièces" />
			<Card.Body>
				<ul className="space-y-1">
					{Object.values(rooms).map((room) => (
						<li key={room.id}>
							<button
								type="button"
								onClick={() => selectRoom(room.id)}
								data-selected={selectedRoom === room}
								className={cn(
									"w-full py-1 px-4 text-left",
									"cursor-pointer",
									"hover:bg-primary/10",
									"border border-border",
									"truncate",
									"data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground",
								)}
							>
								{room.name}
							</button>
						</li>
					))}
				</ul>
			</Card.Body>
			<Card.Footer>
				<Button
					className="mt-4 w-full"
					variant="light"
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
			</Card.Footer>
		</Card>
	);
}

export { RoomsList };
