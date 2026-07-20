import { faLightbulb as farLightbulb } from "@fortawesome/free-regular-svg-icons";
import {
	faChargingStation,
	faLightbulb,
	faTachometerAlt,
	faThermometerHalf,
	faTint,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RefreshCwIcon } from "lucide-react";
import { Button, Card, addMinutes, cn } from "shanty-ui";

import { restartDomo } from "#/server/domo-functions";
import { QueryLoader } from "@/components/query-loader";
import { RollingNumber } from "@/components/rolling-number";
import { RollingTime } from "@/components/rolling-time";
import { SunPhaseIcon } from "@/components/sun-phase-icon";
import { useRooms } from "@/features/architect/use-rooms";
import { useCar } from "@/features/car/use-car";
import { useClock } from "@/features/clock/use-clock";
import { useEnvironmentSensors } from "@/features/environment/use-environment-sensors";
import { useLightBulbs } from "@/features/lighting/use-light-bulbs";

function AppTopBar() {
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
							onClick={async () => {
								await restartDomo();
								window.location.reload();
							}}
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
			<RollingTime date={now} className="text-metric " />
		</div>
	);
}

function Lights() {
	const lights = useLightBulbs();

	const on = lights.filter((light) => light.isOn).length;
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
	const environmentDevices = Object.values(useEnvironmentSensors());

	return (
		<QueryLoader queries={[roomsQuery]}>
			{([rooms]) => {
				let accumulatedTemperature = 0;
				let accumulatedHumidity = 0;
				let accumulatedPressure = 0;
				let thermometersCount = 0;
				let hygrometersCount = 0;
				let barometersCount = 0;

				let temperatureUnit: string | undefined;
				let humidityUnit: string | undefined;
				let pressureUnit: string | undefined;

				rooms.forEach((room) => {
					if (room.haEnvironmentSensorDeviceId) {
						const device = environmentDevices.find(
							(device) => device.id === room.haEnvironmentSensorDeviceId,
						);

						if (device?.thermometer && !!device.thermometer.value) {
							accumulatedTemperature += device.thermometer.value;
							thermometersCount++;
							temperatureUnit = device.thermometer.unitOfMeasurement;
						}

						if (device?.hygrometer && !!device.hygrometer.value) {
							accumulatedHumidity += device.hygrometer.value;
							hygrometersCount++;
							humidityUnit = device.hygrometer.unitOfMeasurement;
						}

						if (device?.barometer && !!device.barometer.value) {
							accumulatedPressure += device.barometer.value;
							barometersCount++;
							pressureUnit = device.barometer.unitOfMeasurement;
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
							<span className="text-muted-foreground text-sm">{temperatureUnit}</span>
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
								<span className="text-muted-foreground text-sm">{humidityUnit}</span>
							</div>
							<div className="flex items-center gap-x-1">
								<span className="text-network">
									<FontAwesomeIcon icon={faTachometerAlt} />
								</span>
								<span className="text-metric text-xs">
									<RollingNumber number={accumulatedPressure / barometersCount} />
								</span>
								<span className="text-muted-foreground text-sm">{pressureUnit}</span>
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

	if (!car) return null;

	const chargedAt = addMinutes(new Date(), car.remainingChargeTime);

	return (
		<div className="flex items-center gap-x-2">
			<img src="/renault_4_small.png" alt="Renault 4" className="h-6 w-auto" />
			<div className="flex gap-x-1">
				<div className="flex items-center">
					<div className="">
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
							{car.charging && (
								<FontAwesomeIcon
									icon={faChargingStation}
									className="text-energy text-sm"
								/>
							)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export { AppTopBar };
