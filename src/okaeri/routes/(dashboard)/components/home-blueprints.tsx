import { faLightbulb as farLightbulb } from "@fortawesome/free-regular-svg-icons";
import {
	faLightbulb,
	faTachometerAlt,
	faThermometerHalf,
	faTint,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Fieldset, Separator, cn } from "shanty-ui";

import type { Room } from "#/shared/architect/architect-types";
import type { DomoEnvironmentSensor } from "#/shared/environment-types";
import type { DomoLightBulb } from "#/shared/lighting-types";
import { QueryLoader } from "@/components/query-loader";
import { useRooms } from "@/features/architect/use-rooms";
import { useEnvironmentSensors } from "@/features/environment/use-environment-sensors";
import { useLightBulbs } from "@/features/lighting/use-light-bulbs";

const GRID_SIZE = 32;
const GRID_COLUMNS = 32;
const GRID_ROWS = 32;

function HomeBlueprints() {
	const roomsQuery = useRooms();
	const lightBulbs = useLightBulbs();
	const environmentSensors = useEnvironmentSensors();

	const width = GRID_COLUMNS * GRID_SIZE;
	const height = GRID_ROWS * GRID_SIZE;

	return (
		<div className="relative h-full w-full overflow-hidden">
			<QueryLoader queries={[roomsQuery]}>
				{([rooms]) => {
					const lightBulbsByRoom: Record<string, DomoLightBulb[]> = {};
					rooms.forEach((room) => {
						lightBulbsByRoom[room.id] = [];
						if (room.haAreaId) {
							lightBulbsByRoom[room.id] =
								lightBulbs.filter((bulb) => bulb.area_id === room.haAreaId) ?? [];
						}
					});

					return (
						<div className="h-full w-full overflow-auto flex-1 relative">
							<div
								className="relative mx-auto overflow-hidden rounded-md bg-background shadow-sm"
								style={{
									width,
									height,
								}}
							>
								{Object.values(rooms).map((room) => (
									<RoomDrawing
										key={room.id}
										room={room}
										lightBulbs={lightBulbsByRoom[room.id]}
										environmentSensor={environmentSensors.find(
											(sensor) => sensor.id === room.haEnvironmentSensorDeviceId,
										)}
									/>
								))}
							</div>
						</div>
					);
				}}
			</QueryLoader>
		</div>
	);
}

function RoomDrawing({
	room,
	lightBulbs,
	environmentSensor,
}: {
	room: Room;
	lightBulbs: DomoLightBulb[];
	environmentSensor?: DomoEnvironmentSensor;
}) {
	const lightsOnCount = lightBulbs.filter((bulb) => bulb.state === "on").length;

	return (
		<Dialog>
			<Dialog.Trigger
				render={<button type="button" />}
				className={cn(
					"@container",
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
				<div className="font-medium">{room.name}</div>
				<div className="grid @min-[12rem]:grid-cols-2">
					{lightBulbs.length > 0 && (
						<div className="flex items-center text-metric">
							<span
								className={cn({
									"text-warning": lightsOnCount > 0,
								})}
							>
								<FontAwesomeIcon
									icon={lightsOnCount === 0 ? farLightbulb : faLightbulb}
								/>
							</span>{" "}
							{lightsOnCount}/{lightBulbs.length}
						</div>
					)}
					{environmentSensor && (
						<>
							{environmentSensor.thermometer && (
								<div className=" flex gap-1 items-center">
									<FontAwesomeIcon icon={faThermometerHalf} />
									<span className="text-metric text-xs">
										{environmentSensor.thermometer.value}
									</span>
									<span className="text-xs text-muted">
										{environmentSensor.thermometer.unitOfMeasurement}
									</span>
								</div>
							)}
							{environmentSensor.hygrometer && (
								<div className="text-metric text-xs flex gap-1 items-center">
									<FontAwesomeIcon icon={faTint} />
									<span className="text-metric text-xs">
										{environmentSensor.hygrometer.value}
									</span>
									<span className="text-xs text-muted">
										{environmentSensor.hygrometer.unitOfMeasurement}
									</span>
								</div>
							)}
							{environmentSensor.barometer && (
								<div className="text-metric text-xs flex gap-1 items-center">
									<FontAwesomeIcon icon={faTachometerAlt} />
									<span className="text-metric text-xs">
										{environmentSensor.barometer.value}
									</span>
									<span className="text-xs text-muted">
										{environmentSensor.barometer.unitOfMeasurement}
									</span>
								</div>
							)}
						</>
					)}
				</div>
			</Dialog.Trigger>
			<Dialog.Popup size="lg">
				<Fieldset legend="Éclairage"></Fieldset>
				{environmentSensor && (
					<Fieldset legend="Environnement">
						<div className="space-y-4">
							{environmentSensor.thermometer && (
								<div className="flex items-center gap-x-4">
									<FontAwesomeIcon icon={faThermometerHalf} />
									<div className="">Température</div>
									<div className="flex items-center gap-x-1">
										<span className="text-metric">
											{environmentSensor.thermometer.value}
										</span>
										<span>{environmentSensor.thermometer.unitOfMeasurement}</span>
									</div>
									{environmentSensor.thermometer.lastUpdated && (
										<>
											<Separator className="bg-border h-4" orientation="vertical" />
											<div className="text-muted">
												màj:{" "}
												{new Date(
													environmentSensor.thermometer.lastUpdated,
												).toLocaleDateString("fr-FR", {
													weekday: "short",
													day: "2-digit",
													month: "short",
													hour: "2-digit",
													minute: "2-digit",
													second: "2-digit",
												})}
											</div>
										</>
									)}
								</div>
							)}

							{environmentSensor.hygrometer && (
								<div className="flex items-center gap-x-4">
									<FontAwesomeIcon icon={faTint} />
									<div className="">Humidité</div>
									<div className="flex items-center gap-x-1">
										<span className="text-metric">
											{environmentSensor.hygrometer.value}
										</span>
										<span>{environmentSensor.hygrometer.unitOfMeasurement}</span>
									</div>
									{environmentSensor.hygrometer.lastUpdated && (
										<>
											<Separator className="bg-border h-4" orientation="vertical" />
											<div className="text-muted">
												màj:{" "}
												{new Date(
													environmentSensor.hygrometer.lastUpdated,
												).toLocaleDateString("fr-FR", {
													weekday: "short",
													day: "2-digit",
													month: "short",
													hour: "2-digit",
													minute: "2-digit",
													second: "2-digit",
												})}
											</div>
										</>
									)}
								</div>
							)}

							{environmentSensor.barometer && (
								<div className="flex items-center gap-x-4">
									<FontAwesomeIcon icon={faTachometerAlt} />
									<div className="">Pression</div>
									<div className="flex items-center gap-x-1">
										<span className="text-metric">
											{environmentSensor.barometer.value}
										</span>
										<span>{environmentSensor.barometer.unitOfMeasurement}</span>
									</div>
									{environmentSensor.barometer.lastUpdated && (
										<>
											<Separator className="bg-border h-4" orientation="vertical" />
											<div className="text-muted">
												màj:{" "}
												{new Date(
													environmentSensor.barometer.lastUpdated,
												).toLocaleDateString("fr-FR", {
													weekday: "short",
													day: "2-digit",
													month: "short",
													hour: "2-digit",
													minute: "2-digit",
													second: "2-digit",
												})}
											</div>
										</>
									)}
								</div>
							)}
						</div>
					</Fieldset>
				)}
			</Dialog.Popup>
		</Dialog>
	);
}

export { HomeBlueprints };
