import type { DomoRegistryEntity } from "#/shared/hass-registry-types";

export interface RgbColor {
	red: number;
	green: number;
	blue: number;
}

export type LightState = "on" | "off" | "unavailable" | "unknown";

interface DomoLight extends DomoRegistryEntity {
	state: LightState;
	domain: "light";

	/**
	 * Valeur normalisée entre 0 et 1.
	 */
	brightness: number | null;

	color: RgbColor | null;

	lastChanged: string | null;

	lastUpdated: string | null;
}

export interface DomoLightBulb extends DomoLight {
	type: "bulb";
}

export interface DomoLightGroup extends DomoLight {
	type: "group";
	lightIds: string[];
}

export interface DomoLightingSnapshot {
	lights: Readonly<Record<string, DomoLightBulb>>;
	lightGroups: Readonly<Record<string, DomoLightGroup>>;
	revision: number;
}
