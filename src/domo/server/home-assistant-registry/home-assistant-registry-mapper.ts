import type {
	HomeAssistantDevice,
	HomeAssistantEntity,
	HomeAssistantWebSocketArea,
	HomeAssistantWebSocketDevice,
	HomeAssistantWebSocketEntity,
} from "#/interfaces/home-assistant";

function fallbackStrings(...values: (string | null | undefined)[]): string {
	for (const value of values) {
		if (value !== null && value !== undefined && value.trim() !== "") {
			return value;
		}
	}

	return "";
}

export function mapHomeAssistantEntity(
	entity: HomeAssistantWebSocketEntity,
): HomeAssistantEntity {
	return {
		raw: entity,

		id: entity.unique_id,
		entityId: entity.entity_id,

		name: fallbackStrings(entity.name, entity.original_name, entity.entity_id),

		originalName: entity.original_name,
		platform: entity.platform,

		deviceId: entity.device_id,
		areaId: entity.area_id,

		createdAt: new Date(entity.created_at * 1000),
		modifiedAt: new Date((entity.modified_at ?? entity.created_at) * 1000),
	};
}

export function mapHomeAssistantDevice(
	device: HomeAssistantWebSocketDevice,
): HomeAssistantDevice {
	return {
		raw: device,

		id: device.id,
		name: fallbackStrings(device.name_by_user, device.name, device.id),
		originalName: device.name,
		manufacturer: device.manufacturer,
		model: device.model,

		areaId: device.area_id,

		createdAt: new Date(device.created_at * 1000),
		modifiedAt: new Date((device.modified_at ?? device.created_at) * 1000),
	};
}

export function mapHomeAssistantArea(area: HomeAssistantWebSocketArea) {
	return {
		raw: area,

		id: area.area_id,
		name: area.name,
		aliases: area.aliases,

		createdAt: new Date(area.created_at * 1000),
		modifiedAt: new Date((area.modified_at ?? area.created_at) * 1000),
	};
}
