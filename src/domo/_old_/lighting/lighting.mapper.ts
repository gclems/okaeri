import type { HaEntity, LightEntity } from "../ha-adapter/ha-types";
import type { DomoLightBulb, DomoLightGroup } from "./lighting.types";

export function isLightBulbEntity(entity: HaEntity): entity is LightEntity {
	return entity.entity_id.startsWith("light.") && !isLightGroupEntity(entity);
}

export function isLightGroupEntity(entity: HaEntity): entity is LightEntity {
	return (
		entity.entity_id.startsWith("light.") &&
		Array.isArray(entity.attributes.lights)
	);
}

export function mapHaLightToDomoLight(entity: LightEntity): DomoLightBulb {
	const brightness =
		typeof entity.attributes.brightness === "number"
			? Math.round((entity.attributes.brightness / 255) * 100)
			: null;

	return {
		entityId: entity.entity_id,
		name:
			typeof entity.attributes.friendly_name === "string"
				? entity.attributes.friendly_name
				: entity.entity_id,
		isOn: entity.state === "on",
		brightness,
		colorMode:
			typeof entity.attributes.color_mode === "string"
				? entity.attributes.color_mode
				: null,
		lastChanged: entity.last_changed,
		color: null,
		type: "single",
		raw: entity,
	};
}

export function mapHaLightToDomoGroup(entity: LightEntity): DomoLightGroup {
	const brightness =
		typeof entity.attributes.brightness === "number"
			? Math.round((entity.attributes.brightness / 255) * 100)
			: null;

	return {
		entityId: entity.entity_id,
		name:
			typeof entity.attributes.friendly_name === "string"
				? entity.attributes.friendly_name
				: entity.entity_id,
		isOn: entity.state === "on",
		brightness,
		colorMode:
			typeof entity.attributes.color_mode === "string"
				? entity.attributes.color_mode
				: null,
		lastChanged: entity.last_changed,
		color: null,
		type: "group",
		raw: entity,
	};
}
