import type { HassEntities } from "home-assistant-js-websocket";

import {
	isBarometer,
	isEnvironmentSensor,
	isHygrometer,
	isThermometer,
	mapBarometer,
	mapHygrometer,
	mapThermometer,
} from "#/server/environment/environment-mapper";
import type { HomeAssistantClient } from "#/server/home-assistant-client";
import type { RegistryService } from "#/server/registry/registry-service";
import type {
	DomoBarometer,
	DomoEnvironmentSensor,
	DomoEnvironmentSnapshot,
	DomoHygrometer,
	DomoThermometer,
} from "#/shared/environment-types";

export type EnvironmentListener = (snapshot: DomoEnvironmentSnapshot) => void;

type EnvironmentMeasurement = DomoThermometer | DomoHygrometer | DomoBarometer;
export class EnvironmentService {
	private snapshot: DomoEnvironmentSnapshot = {
		sensors: {},
		revision: 0,
	};

	private readonly listeners = new Set<EnvironmentListener>();

	public constructor(
		private readonly homeAssistant: HomeAssistantClient,
		private readonly registry: RegistryService,
	) {}

	public getSnapshot(): DomoEnvironmentSnapshot {
		return this.snapshot;
	}

	public getAll(): readonly DomoEnvironmentSensor[] {
		return Object.values(this.snapshot.sensors);
	}

	public getByArea(areaId: string): readonly DomoEnvironmentSensor[] {
		return Object.values(this.snapshot.sensors).filter(
			(sensor) => sensor.areaId === areaId,
		);
	}

	public subscribe(listener: EnvironmentListener): () => void {
		this.listeners.add(listener);

		return () => {
			this.listeners.delete(listener);
		};
	}

	public synchronize(entities: HassEntities): void {
		const sensors: Record<string, DomoEnvironmentSensor> = {};

		for (const entity of Object.values(entities)) {
			if (!isEnvironmentSensor(entity)) {
				continue;
			}

			const registryEntity = this.registry.resolveEntity(entity.entity_id);
			if (!registryEntity.device) {
				continue;
			}

			if (!sensors[registryEntity.device.id]) {
				sensors[registryEntity.device.id] = {
					id: registryEntity.device.id,
					areaId: registryEntity.area?.area_id ?? "",
					deviceId: registryEntity.device.id,

					thermometer: null,
					hygrometer: null,
					barometer: null,
				};
			}

			const sensor = sensors[registryEntity.device.id];

			if (isThermometer(entity)) {
				sensor.thermometer = mapThermometer(entity, registryEntity);
			} else if (isHygrometer(entity)) {
				sensor.hygrometer = mapHygrometer(entity, registryEntity);
			} else if (isBarometer(entity)) {
				sensor.barometer = mapBarometer(entity, registryEntity);
			}
		}

		const sensorsAreEqual = this.areEntitiesEqual(this.snapshot.sensors, sensors);

		if (sensorsAreEqual) {
			return;
		}

		this.snapshot = {
			sensors,
			revision: this.snapshot.revision + 1,
		};

		this.emit();
	}

	private emit(): void {
		for (const listener of this.listeners) {
			listener(this.snapshot);
		}
	}

	private areEntitiesEqual(
		previous: Readonly<Record<string, DomoEnvironmentSensor>>,
		next: Readonly<Record<string, DomoEnvironmentSensor>>,
	): boolean {
		const previousIds = Object.keys(previous);
		const nextIds = Object.keys(next);

		if (previousIds.length !== nextIds.length) {
			return false;
		}

		return nextIds.every((id) => {
			const previousSensor = previous[id];
			const nextSensor = next[id];

			return (
				previousSensor !== undefined &&
				previousSensor.id === nextSensor.id &&
				previousSensor.areaId === nextSensor.areaId &&
				previousSensor.deviceId === nextSensor.deviceId &&
				areMeasurementsEqual(previousSensor.thermometer, nextSensor.thermometer) &&
				areMeasurementsEqual(previousSensor.hygrometer, nextSensor.hygrometer) &&
				areMeasurementsEqual(previousSensor.barometer, nextSensor.barometer)
			);
		});
	}
}

function areMeasurementsEqual(
	a: EnvironmentMeasurement | null,
	b: EnvironmentMeasurement | null,
): boolean {
	if (a === b) {
		return true;
	}

	if (a === null || b === null) {
		return false;
	}

	return (
		a.id === b.id &&
		a.name === b.name &&
		a.domain === b.domain &&
		a.device_id === b.device_id &&
		a.area_id === b.area_id &&
		a.deviceClass === b.deviceClass &&
		a.unitOfMeasurement === b.unitOfMeasurement &&
		Object.is(a.value, b.value) &&
		a.lastChanged === b.lastChanged &&
		a.lastUpdated === b.lastUpdated
	);
}
