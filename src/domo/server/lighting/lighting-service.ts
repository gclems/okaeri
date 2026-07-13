import type { HassEntities } from "home-assistant-js-websocket";

import type { HomeAssistantClient } from "#/server/home-assistant-client";
import type { RegistryService } from "#/server/registry/registry-service";
import type {
	DomoLightBulb,
	DomoLightGroup,
	DomoLightingSnapshot,
	RgbColor,
} from "#/shared/lighting-types";

import {
	isHomeAssistantLight,
	isHomeAssistantLightGroup,
	mapHomeAssistantLight,
	mapHomeAssistantLightGroup,
} from "./lighting-mapper";

export type LightingListener = (snapshot: DomoLightingSnapshot) => void;

export interface TurnOnLightOptions {
	brightness?: number;
	color?: RgbColor;
	colorTemperature?: number;
}

export class LightingService {
	private snapshot: DomoLightingSnapshot = {
		lights: {},
		lightGroups: {},
		revision: 0,
	};

	private readonly listeners = new Set<LightingListener>();

	public constructor(
		private readonly homeAssistant: HomeAssistantClient,
		private readonly registry: RegistryService,
	) {}

	public getSnapshot(): DomoLightingSnapshot {
		return this.snapshot;
	}

	public getAll(): readonly DomoLightBulb[] {
		return Object.values(this.snapshot.lights);
	}

	public get(id: string): DomoLightBulb | null {
		return this.snapshot.lights[id] ?? null;
	}

	public subscribe(listener: LightingListener): () => void {
		this.listeners.add(listener);

		return () => {
			this.listeners.delete(listener);
		};
	}

	/**
	 * Synchronise le silo depuis l’état complet fourni par HA.
	 *
	 * subscribeEntities fournit un dictionnaire complet actualisé,
	 * donc on reconstruit ici le snapshot Lighting.
	 */
	public synchronize(entities: HassEntities): void {
		const lights: Record<string, DomoLightBulb> = {};
		const lightGroups: Record<string, DomoLightGroup> = {};

		for (const entity of Object.values(entities)) {
			if (!entity.entity_id.startsWith("light.")) {
				continue;
			}

			const registryEntity = this.registry.resolveEntity(entity.entity_id);

			if (isHomeAssistantLightGroup(entity)) {
				const group = mapHomeAssistantLightGroup(entity, registryEntity);

				lightGroups[group.id] = group;
				continue;
			}

			if (isHomeAssistantLight(entity)) {
				const light = mapHomeAssistantLight(entity, registryEntity);

				lights[light.id] = light;
			}
		}

		const lightsAreEqual = this.areEntitiesEqual(this.snapshot.lights, lights);

		const lightGroupsAreEqual = this.areEntitiesEqual(
			this.snapshot.lightGroups,
			lightGroups,
		);

		if (lightsAreEqual && lightGroupsAreEqual) {
			return;
		}

		this.snapshot = {
			lights,
			lightGroups,
			revision: this.snapshot.revision + 1,
		};

		this.emit();
	}

	public async turnOn(
		id: string,
		options: TurnOnLightOptions = {},
	): Promise<void> {
		this.assertLightId(id);

		const serviceData: Record<string, unknown> = {};

		if (options.brightness !== undefined) {
			serviceData.brightness = this.normalizeBrightnessForHa(options.brightness);
		}

		if (options.color) {
			serviceData.rgb_color = [
				options.color.red,
				options.color.green,
				options.color.blue,
			];
		}

		if (options.colorTemperature !== undefined) {
			serviceData.color_temp_kelvin = options.colorTemperature;
		}

		await this.homeAssistant.callService("light", "turn_on", serviceData, {
			entity_id: id,
		});
	}

	public async turnOff(id: string): Promise<void> {
		this.assertLightId(id);

		await this.homeAssistant.callService("light", "turn_off", undefined, {
			entity_id: id,
		});
	}

	public async toggle(id: string): Promise<void> {
		this.assertLightId(id);

		await this.homeAssistant.callService("light", "toggle", undefined, {
			entity_id: id,
		});
	}

	public async setBrightness(id: string, brightness: number): Promise<void> {
		await this.turnOn(id, { brightness });
	}

	public async setColor(id: string, color: RgbColor): Promise<void> {
		await this.turnOn(id, { color });
	}

	private normalizeBrightnessForHa(brightness: number): number {
		const normalized = Math.min(1, Math.max(0, brightness));

		return Math.round(normalized * 255);
	}

	private assertLightId(id: string): void {
		if (!id.startsWith("light.")) {
			throw new Error(`Expected a light entity id, received "${id}"`);
		}
	}

	private emit(): void {
		for (const listener of this.listeners) {
			listener(this.snapshot);
		}
	}

	private areEntitiesEqual<
		T extends {
			lastUpdated: string | null;
			name: string;
			area_id: string | null;
			device_id: string | null;
		},
	>(
		previous: Readonly<Record<string, T>>,
		next: Readonly<Record<string, T>>,
	): boolean {
		const previousIds = Object.keys(previous);
		const nextIds = Object.keys(next);

		if (previousIds.length !== nextIds.length) {
			return false;
		}

		return nextIds.every((id) => {
			const previousEntity = previous[id];
			const nextEntity = next[id];

			return (
				previousEntity !== undefined &&
				previousEntity.lastUpdated === nextEntity.lastUpdated &&
				previousEntity.name === nextEntity.name &&
				previousEntity.area_id === nextEntity.area_id &&
				previousEntity.device_id === nextEntity.device_id
			);
		});
	}
}
