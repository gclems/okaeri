import { HslStringColorPicker } from "react-colorful";
import {
	Button,
	Card,
	Checkbox,
	Field,
	Fieldset,
	Input,
	Popover,
	Select,
} from "shanty-ui";

import { useHomeArchitect } from "./use-home-architect";

const hslToHsla = (hsl: string) => {
	const [h, s, l] = hsl
		.replace("hsl(", "")
		.replace(")", "")
		.split(",")
		.map((v) => parseFloat(v));

	return `hsla(${h}, ${s}%, ${l}%, 0.2)`;
};

const hslaToHsl = (hsla: string) => {
	const [h, s, l] = hsla
		.replace("hsla(", "")
		.replace(")", "")
		.split(",")
		.map((v) => parseFloat(v));

	return `hsl(${h}, ${s}%, ${l}%)`;
};

function RoomProperties() {
	const { selectedRoom, haAreas, updateRoom, deleteRoom } = useHomeArchitect();

	const areasOptions = [
		{
			value: null,
			label: "Aucune",
		},
		...haAreas.map((area) => ({
			value: area.id,
			label: area.name,
		})),
	];

	const selectedAreaOption = selectedRoom?.haRoomId
		? areasOptions.find((option) => option.value === selectedRoom.haRoomId)
		: null;

	return (
		<Card className="w-60">
			<Card.Header title="Propriétés" />
			<Card.Body>
				{selectedRoom && (
					<div className="space-y-4">
						<Field label="Nom de la pièce">
							<Input
								name="room-name"
								id="room-name"
								value={selectedRoom.name}
								onChange={(e) =>
									updateRoom(selectedRoom.id, {
										name: e.target.value,
									})
								}
							/>
						</Field>

						<Field label="Zone Home Assistant">
							<Select
								name="ha-area"
								id="ha-area"
								value={selectedAreaOption}
								items={areasOptions}
								onValueChange={(value) =>
									updateRoom(selectedRoom.id, { haRoomId: value })
								}
							/>
						</Field>

						<Field label="Couleur">
							<Popover>
								<Popover.Trigger
									render={
										<Button variant="outlined" color="neutral" className="w-full py-1" />
									}
								>
									<div
										className="w-full h-full"
										style={{ backgroundColor: selectedRoom.color }}
									/>
								</Popover.Trigger>
								<Popover.Popup>
									<HslStringColorPicker
										color={hslaToHsl(selectedRoom.color)}
										onChange={(color) =>
											updateRoom(selectedRoom.id, { color: hslToHsla(color) })
										}
									/>
								</Popover.Popup>
							</Popover>
						</Field>

						<Fieldset legend="Coordonnées">
							<div className="grid grid-cols-2 gap-4">
								<Field label="Position x">
									<Input
										name="room-x"
										id="room-x"
										value={selectedRoom.layout.x}
										onChange={(e) =>
											updateRoom(selectedRoom.id, {
												layout: {
													...selectedRoom.layout,
													x: Number(e.target.value),
												},
											})
										}
									/>
								</Field>
								<Field label="Position y">
									<Input
										name="room-y"
										id="room-y"
										value={selectedRoom.layout.y}
										onChange={(e) =>
											updateRoom(selectedRoom.id, {
												layout: {
													...selectedRoom.layout,
													y: Number(e.target.value),
												},
											})
										}
									/>
								</Field>

								<Field label="Largeur">
									<Input
										name="room-width"
										id="room-width"
										value={selectedRoom.layout.width}
										onChange={(e) =>
											updateRoom(selectedRoom.id, {
												layout: {
													...selectedRoom.layout,
													width: Number(e.target.value),
												},
											})
										}
									/>
								</Field>
								<Field label="Hauteur">
									<Input
										name="room-height"
										id="room-height"
										value={selectedRoom.layout.height}
										onChange={(e) =>
											updateRoom(selectedRoom.id, {
												layout: {
													...selectedRoom.layout,
													height: Number(e.target.value),
												},
											})
										}
									/>
								</Field>
							</div>
						</Fieldset>

						<Fieldset legend="Ouvertures" className="space-y-4">
							<div className="flex flex-col items-center justify-center">
								<Checkbox
									label="Haut"
									checked={!selectedRoom.walls.top}
									onCheckedChange={(checked) => {
										updateRoom(selectedRoom.id, {
											walls: {
												...selectedRoom.walls,
												top: !checked,
											},
										});
									}}
								/>
							</div>

							<div className="flex items-center justify-between">
								<Checkbox
									label="Gauche"
									checked={!selectedRoom.walls.left}
									onCheckedChange={(checked) => {
										updateRoom(selectedRoom.id, {
											walls: {
												...selectedRoom.walls,
												left: !checked,
											},
										});
									}}
								/>
								<Checkbox
									label="Droite"
									checked={!selectedRoom.walls.right}
									onCheckedChange={(checked) => {
										updateRoom(selectedRoom.id, {
											walls: {
												...selectedRoom.walls,
												right: !checked,
											},
										});
									}}
								/>
							</div>
							<div className="flex flex-col items-center justify-center">
								<Checkbox
									label="Bas"
									checked={!selectedRoom.walls.bottom}
									onCheckedChange={(checked) => {
										updateRoom(selectedRoom.id, {
											walls: {
												...selectedRoom.walls,
												bottom: !checked,
											},
										});
									}}
								/>
							</div>
						</Fieldset>
					</div>
				)}
			</Card.Body>
			<Card.Footer className="flex justify-end">
				{selectedRoom && (
					<Button
						color="destructive"
						onClick={() => {
							deleteRoom(selectedRoom.id);
						}}
					>
						Supprimer
					</Button>
				)}
			</Card.Footer>
		</Card>
	);
}

export { RoomProperties };
