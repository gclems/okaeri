import type { DomoEntity } from "#/interfaces/domo";
import type { HomeAssistantEntity } from "#/interfaces/home-assistant";

export interface HomeAssistantLightBulbEntity extends HomeAssistantEntity {}

export interface DomoRgbColor {
	red: number;
	green: number;
	blue: number;
}

export interface DomoLightBulb extends DomoEntity {
	isOn: boolean;

	brightness: number | null;
	color: DomoRgbColor | null;
}

export interface DomoLightGroup extends DomoLightBulb {
	lightNames: string[];
}
