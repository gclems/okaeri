export interface RgbColor {
	red: number;
	green: number;
	blue: number;
}

export type LightState = "on" | "off" | "unavailable" | "unknown";

export interface Light {
	id: string;
	name: string;
	state: LightState;

	/**
	 * Valeur normalisée entre 0 et 1.
	 */
	brightness: number | null;

	color: RgbColor | null;

	lastChanged: string;
	lastUpdated: string;
}

export interface LightGroup extends Light {
	lightIds: string[];
}

export interface LightingSnapshot {
	lights: Readonly<Record<string, Light>>;
	lightGroups: Readonly<Record<string, LightGroup>>;
	revision: number;
}
