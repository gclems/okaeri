import type { AreaRegistryEntry, HomeAssistantArea } from "#/shared/registry";

export function mapHomeAssistantArea(
	entity: AreaRegistryEntry,
): HomeAssistantArea {
	// if (!isHomeAssistantArea(entity)) {
	//     throw new Error(`Cannot map "${entity.entity_id}" as an area`);
	// }

	return {
		id: entity.area_id ?? entity.area_id,

		name: entity.name ?? entity.area_id,
		aliases: Array.isArray(entity.aliases)
			? entity.aliases.filter(
					(alias): alias is string => typeof alias === "string",
				)
			: undefined,
		floorId: entity.floor_id ?? undefined,
	};
}
