import type { HassEntity } from "home-assistant-js-websocket";

import type { ResolvedEntityRegistry } from "#/server/registry/registry-service";
import type {
	DomoBarometer,
	DomoHygrometer,
	DomoThermometer,
} from "#/shared/environment-types";

const ENVIRONMENT_DEVICE_CLASSES = new Set([
	"temperature",
	"humidity",
	"pressure",
]);

function getStringAttribute(entity: HassEntity, name: string): string | null {
	const value = entity.attributes[name];

	return typeof value === "string" ? value : null;
}

function getNumberAttribute(entity: HassEntity, name: string): number | null {
	const value = entity.attributes[name];

	return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function mapName(entity: HassEntity, registry: ResolvedEntityRegistry): string {
	return (
		registry.entity?.name ??
		getStringAttribute(entity, "friendly_name") ??
		registry.entity?.original_name ??
		entity.entity_id
	);
}

export function isEnvironmentSensor(entity: HassEntity): boolean {
	return (
		entity.entity_id.startsWith("sensor.") &&
		typeof entity.attributes.device_class === "string" &&
		ENVIRONMENT_DEVICE_CLASSES.has(entity.attributes.device_class)
	);
}

export function isThermometer(entity: HassEntity): boolean {
	return (
		isEnvironmentSensor(entity) &&
		entity.attributes.device_class === "temperature"
	);
}

export function isHygrometer(entity: HassEntity): boolean {
	return (
		isEnvironmentSensor(entity) && entity.attributes.device_class === "humidity"
	);
}

export function isBarometer(entity: HassEntity): boolean {
	return (
		isEnvironmentSensor(entity) && entity.attributes.device_class === "pressure"
	);
}

export function mapThermometer(
	entity: HassEntity,
	registry: ResolvedEntityRegistry,
): DomoThermometer {
	if (!isThermometer(entity)) {
		throw new Error(`Entity ${entity.entity_id} is not a thermometer`);
	}

	return {
		id: entity.entity_id,
		domain: "sensor",

		device_id: registry.device?.id ?? null,
		area_id: registry.area?.area_id ?? null,

		name: mapName(entity, registry),
		deviceClass: "temperature",
		unitOfMeasurement: entity.attributes.unit_of_measurement as "°C" | "°F",
		value: +entity.state,
		lastChanged: entity.last_changed,
		lastUpdated: entity.last_updated,
	};
}

export function mapHygrometer(
	entity: HassEntity,
	registry: ResolvedEntityRegistry,
): DomoHygrometer {
	if (!isHygrometer(entity)) {
		throw new Error(`Entity ${entity.entity_id} is not a hygrometer`);
	}

	return {
		id: entity.entity_id,
		domain: "sensor",

		device_id: registry.device?.id ?? null,
		area_id: registry.area?.area_id ?? null,

		name: mapName(entity, registry),
		deviceClass: "humidity",
		unitOfMeasurement: entity.attributes.unit_of_measurement as "%",
		value: +entity.state,
		lastChanged: entity.last_changed,
		lastUpdated: entity.last_updated,
	};
}

export function mapBarometer(
	entity: HassEntity,
	registry: ResolvedEntityRegistry,
): DomoBarometer {
	if (!isBarometer(entity)) {
		throw new Error(`Entity ${entity.entity_id} is not a barometer`);
	}

	return {
		id: entity.entity_id,
		domain: "sensor",

		device_id: registry.device?.id ?? null,
		area_id: registry.area?.area_id ?? null,

		name: mapName(entity, registry),
		deviceClass: "pressure",
		unitOfMeasurement: entity.attributes.unit_of_measurement as
			| "hPa"
			| "inHg"
			| "mmHg",
		value: +entity.state,
		lastChanged: entity.last_changed,
		lastUpdated: entity.last_updated,
	};
}
