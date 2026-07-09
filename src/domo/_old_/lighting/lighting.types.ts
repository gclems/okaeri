import type { HaEntity } from "../ha-adapter/ha-types";

type DomoLight = {
	entityId: string;
	name: string;
	isOn: boolean;
	brightness: number | null;
	colorMode: string | null;
	lastChanged: string;
	color: [number, number, number] | null;
	raw: HaEntity;
};

export type DomoLightBulb = DomoLight & {
	type: "single";
};

export type DomoLightGroup = DomoLight & {
	type: "group";
};
