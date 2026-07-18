import { faLightbulb as farLightbulb } from "@fortawesome/free-regular-svg-icons";
import {
	faLightbulb,
	faTachometerAlt,
	faThermometerHalf,
	faTint,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RefreshCwIcon } from "lucide-react";
import { Button, Card, cn } from "shanty-ui";

import { QueryLoader } from "@/components/query-loader";
import { RollingNumber } from "@/components/rolling-number";
import { SunPhaseIcon } from "@/components/sun-phase-icon";
import { useRooms } from "@/features/architect/use-rooms";
import { useCar } from "@/features/car/use-car";
import { useClock } from "@/features/clock/use-clock";
import { useEnvironmentSensors } from "@/features/environment/use-environment-sensors";
import { useLightBulbs } from "@/features/lighting/use-light-bulbs";

function AppTopBar() {
	// const carSettingQuery = useFindSettings("car_device_id");
	// console.log({ carSetting: carSettingQuery.data?.value });

	// const devicesQuery = useHomeAssistantDevices();
	// // const entitiesQuery = useHomeAssistantEntities();

	// if (devicesQuery.data && carSettingQuery.data) {
	// 	const carDevice = devicesQuery.data.find(
	// 		(device) => device.id === carSettingQuery.data?.value,
	// 	);
	// 	console.log({ carDevice });
	// }

	return (
		<div className="flex items-center gap-x-4">
			<Card className="flex-1" size="xs">
				<Card.Body>
					<div className="flex items-center justify-between gap-x-8 divide-red-500 divide-solid">
						<DateTime />
						<Lights />
						<Environment />
						<Car />
						<Button
							variant="ghost"
							color="neutral"
							size="sm"
							onClick={() => window.location.reload()}
						>
							<RefreshCwIcon />
						</Button>
					</div>
				</Card.Body>
			</Card>
		</div>
	);
}

function DateTime() {
	const now = useClock();

	return (
		<div className="flex items-center gap-x-1">
			<span className="text-energy">
				<SunPhaseIcon />
			</span>
			<div className="text-heading text-center">
				{now.toLocaleDateString("fr-FR", {
					weekday: "short",
					day: "2-digit",
					month: "short",
				})}
			</div>
			<time className="text-metric flex items-center justify-center gap-x-1">
				<div>
					<RollingNumber
						number={now.getHours()}
						formatter={(value) => Math.round(value).toString().padStart(2, "0")}
					/>
					:
					<RollingNumber
						number={now.getMinutes()}
						formatter={(value) => Math.round(value).toString().padStart(2, "0")}
					/>
				</div>
			</time>
		</div>
	);
}

function Lights() {
	const lights = useLightBulbs();

	const on = lights.filter((light) => light.state === "on").length;
	return (
		<div className="">
			<span className={cn({ "text-energy": on > 0 })}>
				<FontAwesomeIcon icon={on > 0 ? faLightbulb : farLightbulb} />
			</span>
			<span className="text-metric font-semibold">{on}</span>
		</div>
	);
}

function Environment() {
	const roomsQuery = useRooms();
	const environmentDevices = useEnvironmentSensors();

	return (
		<QueryLoader queries={[roomsQuery]}>
			{([rooms]) => {
				let accumulatedTemperature = 0;
				let accumulatedHumidity = 0;
				let accumulatedPressure = 0;
				let thermometersCount = 0;
				let hygrometersCount = 0;
				let barometersCount = 0;

				rooms.forEach((room) => {
					if (room.haEnvironmentSensorDeviceId) {
						const device = environmentDevices.find(
							(device) => device.id === room.haEnvironmentSensorDeviceId,
						);

						if (device?.thermometer && !!device.thermometer.value) {
							accumulatedTemperature += device.thermometer.value;
							thermometersCount++;
						}

						if (device?.hygrometer && !!device.hygrometer.value) {
							accumulatedHumidity += device.hygrometer.value;
							hygrometersCount++;
						}

						if (device?.barometer && !!device.barometer.value) {
							accumulatedPressure += device.barometer.value;
							barometersCount++;
						}
					}
				});

				return (
					<div className="flex gap-x-2">
						<div className="flex items-center gap-x-1">
							<span className="text-temperature">
								<FontAwesomeIcon icon={faThermometerHalf} />
							</span>
							<span className="text-metric">
								<RollingNumber
									number={accumulatedTemperature / thermometersCount}
									formatter={(value) => value.toFixed(1)}
								/>
							</span>
						</div>
						<div className="text-xs">
							<div className="flex items-center gap-x-1">
								<span className="text-humidity">
									<FontAwesomeIcon icon={faTint} />
								</span>
								<span className="text-metric text-xs">
									<RollingNumber
										number={accumulatedHumidity / hygrometersCount}
										formatter={(value) => value.toFixed(1)}
									/>
								</span>
							</div>
							<div className="flex items-center gap-x-1">
								<span className="text-network">
									<FontAwesomeIcon icon={faTachometerAlt} />
								</span>
								<span className="text-metric text-xs">
									<RollingNumber
										number={accumulatedPressure / barometersCount}
										formatter={(value) => value.toFixed(1)}
									/>
								</span>
							</div>
						</div>
					</div>
				);
			}}
		</QueryLoader>
	);
}

function Car() {
	const car = useCar();

	return (
		<div className="flex items-center gap-x-2">
			<img src="/renault_4_small.png" alt="Renault 4" className="h-6 w-auto" />
			<div className="flex gap-x-1">
				<div className="flex items-center">
					<span
						className={cn("text-metric text-2xl font-semibold", {
							"text-success": car.batteryLevel >= 80,
							"text-warning": car.batteryLevel > 20 && car.batteryLevel <= 50,
							"text-destructive": car.batteryLevel <= 20,
						})}
					>
						<RollingNumber
							number={car.batteryLevel}
							formatter={(value) => Math.round(value).toString()}
						/>
						%
					</span>
				</div>
				{car.charging && (
					<div className=" text-sm flex items-end text-success text-metric">
						<RollingNumber
							number={car.chargingPower}
							formatter={(value) => value.toFixed(1).toString()}
						/>
						{car.chargingUnitOfMeasure}
					</div>
				)}
			</div>
		</div>
	);
}

export { AppTopBar };
