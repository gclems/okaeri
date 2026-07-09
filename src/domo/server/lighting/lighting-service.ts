import type { HassEntities } from "home-assistant-js-websocket";

import type { Light, LightingSnapshot, RgbColor } from "../../shared/lighting";
import type { HomeAssistantClient } from "../home-assistant-client";
import {
	isHomeAssistantLight,
	isHomeAssistantLightGroup,
	mapHomeAssistantLight,
	mapHomeAssistantLightGroup,
} from "./lighting-mapper";

export type LightingListener = (snapshot: LightingSnapshot) => void;

export interface TurnOnLightOptions {
	brightness?: number;
	color?: RgbColor;
	colorTemperature?: number;
}

export class LightingService {
	private snapshot: LightingSnapshot = {
		lights: {},
		lightGroups: {},
		revision: 0,
	};

	private readonly listeners = new Set<LightingListener>();

	public constructor(private readonly homeAssistant: HomeAssistantClient) {}

	public getSnapshot(): LightingSnapshot {
		return this.snapshot;
	}

	public getAll(): readonly Light[] {
		return Object.values(this.snapshot.lights);
	}

	public get(id: string): Light | null {
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
		const lights = Object.fromEntries(
			Object.values(entities)
				.filter((e) => isHomeAssistantLight(e))
				.map((entity) => {
					const light = mapHomeAssistantLight(entity);

					return [light.id, light];
				}),
		);
		const lightGroups = Object.fromEntries(
			Object.values(entities)
				.filter((e) => isHomeAssistantLightGroup(e))
				.map((entity) => {
					const group = mapHomeAssistantLightGroup(entity);

					return [group.id, group];
				}),
		);

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
			lastUpdated: string;
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
				previousEntity.lastUpdated === nextEntity.lastUpdated
			);
		});
	}
}
