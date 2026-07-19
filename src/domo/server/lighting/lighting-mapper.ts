import type { HassEntity } from "home-assistant-js-websocket";

import type {
	DomoLightBulb,
	DomoLightGroup,
	DomoRgbColor,
} from "#/interfaces/lighting";
import type { ResolvedEntityRegistry } from "#/server/home-assistant-registry/home-assistant-registry-service";

function getNumberAttribute(entity: HassEntity, name: string): number | null {
	const value = entity.attributes[name];

	return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function getRgbColor(entity: HassEntity): DomoRgbColor | null {
	const value = entity.attributes.rgb_color;

	if (
		!Array.isArray(value) ||
		value.length < 3 ||
		value.some(
			(component) => typeof component !== "number" || !Number.isFinite(component),
		)
	) {
		return null;
	}

	return {
		red: value[0],
		green: value[1],
		blue: value[2],
	};
}

function mapBrightness(entity: HassEntity): number | null {
	const brightness = getNumberAttribute(entity, "brightness");

	if (brightness === null) {
		return null;
	}

	return Math.min(1, Math.max(0, brightness / 255));
}

function isLightDomain(entity: HassEntity): boolean {
	return entity.entity_id.startsWith("light.");
}

function getLightsNames(entity: HassEntity): string[] {
	const value = Array.isArray(entity.attributes.entity_id)
		? entity.attributes.entity_id
		: entity.attributes.lights;

	if (!Array.isArray(value)) {
		return [];
	}

	return value.filter(
		(item): item is string =>
			typeof item === "string" && item.startsWith("light."),
	);
}

export function isHomeAssistantLight(entity: HassEntity): boolean {
	return isLightDomain(entity) && getLightsNames(entity).length === 0;
}

export function isHomeAssistantLightGroup(entity: HassEntity): boolean {
	return isLightDomain(entity) && getLightsNames(entity).length > 0;
}

export function mapHomeAssistantLight(
	entity: HassEntity,
	registryEntity: ResolvedEntityRegistry,
): DomoLightBulb {
	if (!isHomeAssistantLight(entity) || !registryEntity.entity) {
		throw new Error(`Cannot map "${entity.entity_id}" as a light`);
	}

	return {
		id: registryEntity.entity.id,
		name: registryEntity.entity.name,
		areaId: registryEntity.area?.id ?? null,
		deviceId: registryEntity.device?.id ?? null,
		lastStateUpdated: new Date(entity.last_changed),
		lastUpdated: new Date(registryEntity.entity.modifiedAt),

		isOn: entity.state === "on",
		brightness: mapBrightness(entity),
		color: getRgbColor(entity),
	};
}

export function mapHomeAssistantLightGroup(
	entity: HassEntity,
	registryEntity: ResolvedEntityRegistry,
): DomoLightGroup {
	if (!isHomeAssistantLightGroup(entity) || !registryEntity.entity) {
		throw new Error(`Cannot map "${entity.entity_id}" as a light group`);
	}

	return {
		id: entity.entity_id,

		name: registryEntity.entity.name,

		areaId: registryEntity.area?.id ?? null,
		deviceId: registryEntity.device?.id ?? null,
		lastStateUpdated: new Date(entity.last_changed),
		lastUpdated: new Date(registryEntity.entity.modifiedAt),

		isOn: entity.state === "on",
		brightness: mapBrightness(entity),
		color: getRgbColor(entity),

		lightNames: getLightsNames(entity),
	};
}
