import type {
	HassAreaRegistryEntry,
	HassDeviceRegistryEntry,
	HassEntityRegistryEntry,
} from "#/shared/hass-registry-types";

import type { HomeAssistantClient } from "../home-assistant-client";

export type ResolvedEntityRegistry = {
	entity: HassEntityRegistryEntry | null;
	device: HassDeviceRegistryEntry | null;
	area: HassAreaRegistryEntry | null;
};

export class RegistryService {
	private entities = new Map<string, HassEntityRegistryEntry>();
	private devices = new Map<string, HassDeviceRegistryEntry>();
	private areas = new Map<string, HassAreaRegistryEntry>();

	public constructor(private readonly homeAssistant: HomeAssistantClient) {}

	public async load(): Promise<void> {
		const [entities, devices, areas] = await Promise.all([
			this.homeAssistant.sendCommand<HassEntityRegistryEntry[]>({
				type: "config/entity_registry/list",
			}),

			this.homeAssistant.sendCommand<HassDeviceRegistryEntry[]>({
				type: "config/device_registry/list",
			}),

			this.homeAssistant.sendCommand<HassAreaRegistryEntry[]>({
				type: "config/area_registry/list",
			}),
		]);

		this.entities = new Map(entities.map((entity) => [entity.entity_id, entity]));

		this.devices = new Map(devices.map((device) => [device.id, device]));

		this.areas = new Map(areas.map((area) => [area.area_id, area]));

		// console.log({ entities: this.entities });
		// console.log({ devices: this.devices });
		// console.log({ areas: this.areas });
	}

	public getEntities(): Map<string, HassEntityRegistryEntry> {
		return this.entities;
	}

	public getDevices(): Map<string, HassDeviceRegistryEntry> {
		return this.devices;
	}

	public getAreas(): Map<string, HassAreaRegistryEntry> {
		return this.areas;
	}

	resolveEntity(entityId: string): ResolvedEntityRegistry {
		const entity = this.entities.get(entityId) ?? null;

		if (!entity) {
			return {
				entity: null,
				device: null,
				area: null,
			};
		}

		const device = entity.device_id
			? (this.devices.get(entity.device_id) ?? null)
			: null;

		const resolvedAreaId = entity.area_id ?? device?.area_id ?? null;

		const area = resolvedAreaId ? (this.areas.get(resolvedAreaId) ?? null) : null;

		return {
			entity,
			device,
			area,
		};
	}
}
