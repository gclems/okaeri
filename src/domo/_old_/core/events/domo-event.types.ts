import type { DomoLightBulb, DomoLightGroup } from "#/domo/_old_/lighting";

export type DomoLightBulbUpdatedEvent = {
	type: "light.bulb.updated";
	payload: DomoLightBulb;
};

export type DomoLightGroupUpdatedEvent = {
	type: "light.group.updated";
	payload: DomoLightGroup;
};

export type DomoEvent = DomoLightBulbUpdatedEvent | DomoLightGroupUpdatedEvent;
