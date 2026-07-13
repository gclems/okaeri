import type { HassEntity } from "home-assistant-js-websocket";

import type { ResolvedEntityRegistry } from "#/server/registry/registry-service";

import type {
	DomoLightBulb,
	DomoLightGroup,
	LightState,
	RgbColor,
} from "../../shared/lighting-types";

function getStringAttribute(entity: HassEntity, name: string): string | null {
	const value = entity.attributes[name];

	return typeof value === "string" ? value : null;
}

function getNumberAttribute(entity: HassEntity, name: string): number | null {
	const value = entity.attributes[name];

	return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function getRgbColor(entity: HassEntity): RgbColor | null {
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

function mapName(entity: HassEntity, registry: ResolvedEntityRegistry): string {
	return (
		registry.entity?.name ??
		getStringAttribute(entity, "friendly_name") ??
		registry.entity?.original_name ??
		entity.entity_id
	);
}

function mapLightState(state: string): LightState {
	switch (state) {
		case "on":
		case "off":
		case "unavailable":
		case "unknown":
			return state;

		default:
			return "unknown";
	}
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

function getLightIds(entity: HassEntity): string[] {
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
	return isLightDomain(entity) && getLightIds(entity).length === 0;
}

export function isHomeAssistantLightGroup(entity: HassEntity): boolean {
	return isLightDomain(entity) && getLightIds(entity).length > 0;
}

export function mapHomeAssistantLight(
	entity: HassEntity,
	registry: ResolvedEntityRegistry,
): DomoLightBulb {
	if (!isHomeAssistantLight(entity)) {
		throw new Error(`Cannot map "${entity.entity_id}" as a light`);
	}

	return {
		id: entity.entity_id,
		domain: "light",
		type: "bulb",

		name: mapName(entity, registry),

		area_id: registry.area?.area_id ?? null,
		device_id: registry.device?.id ?? null,

		state: mapLightState(entity.state),

		brightness: mapBrightness(entity),
		color: getRgbColor(entity),

		lastChanged: entity.last_changed,
		lastUpdated: entity.last_updated,
	};
}

export function mapHomeAssistantLightGroup(
	entity: HassEntity,
	registry: ResolvedEntityRegistry,
): DomoLightGroup {
	if (!isHomeAssistantLightGroup(entity)) {
		throw new Error(`Cannot map "${entity.entity_id}" as a light group`);
	}

	return {
		id: entity.entity_id,
		domain: "light",
		type: "group",

		name: mapName(entity, registry),

		area_id: registry.area?.area_id ?? null,
		device_id: registry.device?.id ?? null,

		state: mapLightState(entity.state),

		brightness: mapBrightness(entity),
		color: getRgbColor(entity),

		lastChanged: entity.last_changed,
		lastUpdated: entity.last_updated,

		lightIds: getLightIds(entity),
	};
}
