import type { HassEntities } from "home-assistant-js-websocket";

import { mapCar } from "#/server/car/car-mapper";
import type { HomeAssistantClient } from "#/server/home-assistant-client";
import type { RegistryService } from "#/server/registry/registry-service";
import { findSettingByKey } from "#/server/settings/settings-service";
import type { Car, DomoCarSnapshot } from "#/shared/car-types";

export type CarListener = (snapshot: DomoCarSnapshot) => void;

export class CarService {
	private snapshot: DomoCarSnapshot = {
		carSetting: null,
		car: null,
		revision: 0,
	};

	private readonly listeners = new Set<CarListener>();

	public constructor(
		private readonly homeAssistant: HomeAssistantClient,
		private readonly registry: RegistryService,
	) {}

	public getSnapshot(): DomoCarSnapshot {
		return this.snapshot;
	}

	public getCar(): Car | null {
		return this.snapshot.car;
	}

	public subscribe(listener: CarListener): () => void {
		this.listeners.add(listener);

		return () => {
			this.listeners.delete(listener);
		};
	}

	public carSettingChanged(): void {
		this.snapshot.carSetting = null;
	}

	public async synchronize(entities: HassEntities): Promise<void> {
		const carSetting =
			this.snapshot?.carSetting ?? (await findSettingByKey("car_device_id"));

		if (!carSetting || !carSetting.value) {
			return;
		}

		const device = this.registry.getDevices().get(carSetting.value);

		if (!device) {
			return;
		}

		// create car object
		const car = mapCar(device.id, this.registry, entities);

		const newSnapshot: DomoCarSnapshot = {
			carSetting,
			car,
			revision: this.snapshot.revision + 1,
		};

		if (!this.areSnapshotsEqual(this.snapshot, newSnapshot)) {
			this.snapshot = newSnapshot;
			this.emit();
		}
	}

	private emit(): void {
		for (const listener of this.listeners) {
			listener(this.snapshot);
		}
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
