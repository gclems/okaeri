import type {
	HomeAssistantArea,
	HomeAssistantDevice,
	HomeAssistantEntity,
	HomeAssistantWebSocketArea,
	HomeAssistantWebSocketDevice,
	HomeAssistantWebSocketEntity,
} from "#/interfaces/home-assistant";
import type { HomeAssistantClient } from "#/server/home-assistant-client";
import {
	mapHomeAssistantArea,
	mapHomeAssistantDevice,
	mapHomeAssistantEntity,
} from "#/server/home-assistant-registry/home-assistant-registry-mapper";

export type ResolvedEntityRegistry = {
	entity: HomeAssistantEntity | null;
	device: HomeAssistantDevice | null;
	area: HomeAssistantArea | null;
};

export class HomeAssistantRegistryService {
	private _entities = new Map<string, HomeAssistantEntity>();
	private _devices = new Map<string, HomeAssistantDevice>();
	private _areas = new Map<string, HomeAssistantArea>();

	public constructor(private readonly homeAssistant: HomeAssistantClient) {}

	public async load(): Promise<void> {
		const [entities, devices, areas] = await Promise.all([
			this.homeAssistant.sendCommand<HomeAssistantWebSocketEntity[]>({
				type: "config/entity_registry/list",
			}),
			this.homeAssistant.sendCommand<HomeAssistantWebSocketDevice[]>({
				type: "config/device_registry/list",
			}),
			this.homeAssistant.sendCommand<HomeAssistantWebSocketArea[]>({
				type: "config/area_registry/list",
			}),
		]);

		const domoEntities = entities.map((e) => mapHomeAssistantEntity(e));
		this._entities = new Map(
			domoEntities.map((entity) => [entity.entityId, entity]),
		);

		const domoDevices = devices.map((d) => mapHomeAssistantDevice(d));
		this._devices = new Map(domoDevices.map((device) => [device.id, device]));

		const domoAreas = areas.map((a) => mapHomeAssistantArea(a));
		this._areas = new Map(domoAreas.map((area) => [area.id, area]));
	}

	public get entities() {
		return this._entities;
	}

	public get devices() {
		return this._devices;
	}

	public get areas() {
		return this._areas;
	}

	public resolveEntityRegistry(entityId: string): ResolvedEntityRegistry {
		const entity = this._entities.get(entityId) ?? null;
		const device = entity?.deviceId
			? (this._devices.get(entity.deviceId) ?? null)
			: null;
		const area = device?.areaId ? (this._areas.get(device.areaId) ?? null) : null;

		return { entity, device, area };
	}
}
