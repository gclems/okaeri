import type { HassEntities } from "home-assistant-js-websocket";

import { mapCar } from "#/server/car/car-mapper";
import type { HomeAssistantClient } from "#/server/home-assistant-client";
import type { HomeAssistantRegistryService } from "#/server/home-assistant-registry/home-assistant-registry-service";
import { HomeAssistantService } from "#/server/home-assistant-service";
import { findSettingByKey } from "#/server/settings/settings-service";
import type { DomoCarSnapshot } from "#/shared/car-types";

export type CarListener = (snapshot: DomoCarSnapshot) => void;

export class CarService extends HomeAssistantService<DomoCarSnapshot> {
	public constructor(
		homeAssistant: HomeAssistantClient,
		registry: HomeAssistantRegistryService,
	) {
		super("car", homeAssistant, registry);
	}

	public carSettingChanged(): void {
		this.snapshot.carSetting = null;
	}

	public async synchronize(entities: HassEntities): Promise<boolean> {
		const carSetting =
			this.snapshot?.carSetting ?? (await findSettingByKey("car_device_id"));

		if (!carSetting || !carSetting.value) {
			const changed =
				this.snapshot.carSetting !== null || this.snapshot.car !== null;

			if (changed) {
				this.snapshot = {
					carSetting: null,
					car: null,
					revision: this.snapshot.revision + 1,
				};
			}

			return changed;
		}

		const device = this.registry.devices.get(carSetting.value);

		if (!device) {
			return false;
		}

		// create car object
		const car = mapCar(device.id, this.registry, entities);

		const newSnapshot: DomoCarSnapshot = {
			carSetting,
			car,
			revision: this.snapshot.revision + 1,
		};

		if (this.areSnapshotsEqual(this.snapshot, newSnapshot)) {
			return false;
		}

		this.snapshot = newSnapshot;
		return true;
	}

	private areSnapshotsEqual(a: DomoCarSnapshot, b: DomoCarSnapshot): boolean {
		const sameSettings = a.carSetting === b.carSetting;
		const sameCarObject = a.car === b.car;

		const similarCarProperties = true;
		if (a.car && b.car) {
			a.car.name === b.car.name &&
				a.car.device_id === b.car.device_id &&
				a.car.batteryLevel === b.car.batteryLevel &&
				a.car.batteryLife === b.car.batteryLife &&
				a.car.batteryTemperature === b.car.batteryTemperature &&
				a.car.wired === b.car.wired &&
				a.car.charging === b.car.charging &&
				a.car.chargingPower === b.car.chargingPower &&
				a.car.chargingUnitOfMeasure === b.car.chargingUnitOfMeasure &&
				a.car.remainingChargeTime === b.car.remainingChargeTime &&
				a.car.chargingMode === b.car.chargingMode &&
				a.car.maximumChargePower === b.car.maximumChargePower &&
				a.car.place === b.car.place &&
				a.car.minimumChargeLevel === b.car.minimumChargeLevel &&
				a.car.targetChargeLevel === b.car.targetChargeLevel &&
				a.car.totalMileage === b.car.totalMileage &&
				a.car.exteriorTemperature === b.car.exteriorTemperature;
		}

		return sameSettings && (sameCarObject || similarCarProperties);
	}
}
