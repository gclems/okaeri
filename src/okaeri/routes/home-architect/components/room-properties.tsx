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

function RoomProperties() {
	const { selectedRoom, haAreas, haDevices, updateRoom, deleteRoom } =
		useHomeArchitect();

	const areasOptions = [
		{
			value: "",
			label: "Aucune",
		},
		...haAreas.map((area) => ({
			value: area.id,
			label: area.name,
		})),
	];

	const selectedAreaOption = selectedRoom?.haAreaId
		? areasOptions.find((option) => option.value === selectedRoom.haAreaId)
		: areasOptions[0];

	const sensorsOptions = [
		{
			value: "",
			label: "Aucun",
		},
		...haDevices
			.map((device) => ({
				value: device.id,
				label: device.name,
			}))
			.sort((a, b) => a.label.localeCompare(b.label)),
	];

	const selectedSensorOption = selectedRoom?.haEnvironmentSensorDeviceId
		? sensorsOptions.find(
				(option) => option.value === selectedRoom.haEnvironmentSensorDeviceId,
			)
		: sensorsOptions[0];

	return (
		<Card className="w-80">
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
									updateRoom(selectedRoom.id, { haAreaId: value })
								}
							/>
						</Field>

						<Field label="Thermomètre">
							<Select
								name="ha-environment-sensor"
								id="ha-environment-sensor"
								value={selectedSensorOption}
								items={sensorsOptions}
								onValueChange={(value) =>
									updateRoom(selectedRoom.id, { haEnvironmentSensorDeviceId: value })
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
										color={selectedRoom.color}
										onChange={(color) => updateRoom(selectedRoom.id, { color })}
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
