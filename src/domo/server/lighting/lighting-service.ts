import type { HassEntities } from "home-assistant-js-websocket";

import type {
	DomoLightBulb,
	DomoLightGroup,
	DomoRgbColor,
} from "#/interfaces/lighting";
import type { DomoServiceSnapshot } from "#/server/domo-service-snapshot";
import type { HomeAssistantClient } from "#/server/home-assistant-client";
import type { HomeAssistantRegistryService } from "#/server/home-assistant-registry/home-assistant-registry-service";
import { HomeAssistantService } from "#/server/home-assistant-service";

import {
	isHomeAssistantLight,
	isHomeAssistantLightGroup,
	mapHomeAssistantLight,
	mapHomeAssistantLightGroup,
} from "./lighting-mapper";

export interface TurnOnLightOptions {
	brightness?: number;
	color?: DomoRgbColor;
	colorTemperature?: number;
}

export type DomoLightingSnapshot = DomoServiceSnapshot & {
	lights: Record<string, DomoLightBulb>;
	lightGroups: Record<string, DomoLightGroup>;
};

export class LightingService extends HomeAssistantService<DomoLightingSnapshot> {
	public constructor(
		homeAssistant: HomeAssistantClient,
		registry: HomeAssistantRegistryService,
	) {
		super("lighting", homeAssistant, registry);
	}

	public synchronize(entities: HassEntities): boolean {
		const lights: Record<string, DomoLightBulb> = {};
		const lightGroups: Record<string, DomoLightGroup> = {};

		for (const entity of Object.values(entities)) {
			if (!entity.entity_id.startsWith("light.")) {
				continue;
			}

			const registryEntity = this.registry.resolveEntityRegistry(entity.entity_id);

			if (isHomeAssistantLightGroup(entity)) {
				const group = mapHomeAssistantLightGroup(entity, registryEntity);
				lightGroups[group.id] = group;
			} else if (isHomeAssistantLight(entity)) {
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
			return false;
		}

		this.snapshot = {
			lights,
			lightGroups,
			revision: this.snapshot.revision + 1,
		};

		return true;
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

		if (this.shouldBeTurnedOff(options.color, options.brightness)) {
			await this.homeAssistant.callService("light", "turn_off", serviceData, {
				entity_id: id,
			});
		} else {
			await this.homeAssistant.callService("light", "turn_on", serviceData, {
				entity_id: id,
			});
		}
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

	public async setColor(id: string, color: DomoRgbColor): Promise<void> {
		await this.turnOn(id, { color });
	}

	public async setColorAndBrightness(
		id: string,
		color: DomoRgbColor,
		brightness: number,
	): Promise<void> {
		await this.turnOn(id, { color, brightness });
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

	private shouldBeTurnedOff(
		color?: DomoRgbColor | null,
		brightness?: number | null,
	): boolean {
		if (!color && !brightness) {
			return true;
		}

		if (!!brightness && brightness <= 0) {
			return true;
		}

		if (!!color && color.red === 0 && color.green === 0 && color.blue === 0) {
			return true;
		}

		return false;
	}

	private areEntitiesEqual<T extends DomoLightBulb>(
		previous: Record<string, T>,
		next: Record<string, T>,
	): boolean {
		const previousIds = Object.keys(previous ?? {});
		const nextIds = Object.keys(next);

		if (previousIds.length !== nextIds.length) {
			return false;
		}

		return nextIds.every((id) => {
			const previousEntity = previous[id];
			const nextEntity = next[id];

			if (!previousEntity || !nextEntity) {
				return false;
			}

			return (
				previousEntity !== undefined &&
				previousEntity.lastUpdated === nextEntity.lastUpdated &&
				previousEntity.name === nextEntity.name &&
				previousEntity.areaId === nextEntity.areaId &&
				previousEntity.deviceId === nextEntity.deviceId &&
				previousEntity.isOn === nextEntity.isOn &&
				previousEntity.brightness === nextEntity.brightness &&
				((previousEntity.color === null && nextEntity.color === null) ||
					(previousEntity.color !== null &&
						nextEntity.color !== null &&
						previousEntity.color.red === nextEntity.color.red &&
						previousEntity.color.green === nextEntity.color.green &&
						previousEntity.color.blue === nextEntity.color.blue))
			);
		});
	}
}
