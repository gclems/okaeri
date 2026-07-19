import type { HassEntities } from "home-assistant-js-websocket";

import type { RegistryService } from "#/server/registry/registry-service";
import type { Car } from "#/shared/car-types";
import type { HassDeviceRegistryEntry } from "#/shared/hass-registry-types";

export function mapCar(
	carDeviceId: string,
	registry: RegistryService,
	entities: HassEntities,
): Car | null {
	const device = registry.getDevices().get(carDeviceId);

	if (!device) {
		return null;
	}

	// create car object
	const car: Car = {
		name: getDeviceName(device),
		device_id: device.id,
		batteryLevel: 0,
		batteryLife: 0,
		batteryTemperature: 0,
		wired: false,
		charging: false,
		chargingPower: 0,
		chargingUnitOfMeasure: "KWh",
		remainingChargeTime: 0,
		chargingMode: "",
		maximumChargePower: 0,
		place: "",
		minimumChargeLevel: 0,
		targetChargeLevel: 0,
		totalMileage: 0,
		exteriorTemperature: 0,
	};

	const formattedDeviceName = getDeviceName(device)
		.replace(/\s+/g, "_")
		.toLowerCase();

	const batteryEntityName = `sensor.${formattedDeviceName}_batterie`;
	const batteryLifeEntityName = `sensor.${formattedDeviceName}_autonomie_de_la_batterie`;
	// ...
	const mileageEntityName = `sensor.${formattedDeviceName}_kilometrage`;

	for (const entity of Object.values(entities)) {
		if (entity.entity_id === batteryEntityName) {
			car.batteryLevel = entity.state as unknown as number;
		}

		if (entity.entity_id === batteryLifeEntityName) {
			car.batteryLife = entity.state as unknown as number;
		}

		// ...

		if (entity.entity_id === mileageEntityName) {
			car.totalMileage = entity.state as unknown as number;
		}
	}

	return car;
}

const getDeviceName = (device: HassDeviceRegistryEntry): string => {
	return device.name_by_user ?? device.name ?? device.id;
};
