import { HaClient } from "../ha-adapter/ha-client";
import {
	mapHaLightToDomoGroup,
	mapHaLightToDomoLight,
} from "./lighting.mapper";
import type { DomoLightBulb, DomoLightGroup } from "./lighting.types";

export class LightService {
	constructor(private readonly haClient = new HaClient()) {}

	async getLightBulbs(): Promise<DomoLightBulb[]> {
		const states = await this.haClient.getStates();

		return states
			.filter((entity) => entity.entity_id.startsWith("light."))
			.map(mapHaLightToDomoLight)
			.sort((a, b) => a.name.localeCompare(b.name));
	}

	async getLightGroups(): Promise<DomoLightGroup[]> {
		const states = await this.haClient.getStates();

		return states
			.filter((entity) => entity.entity_id.startsWith("light."))
			.map(mapHaLightToDomoGroup)
			.sort((a, b) => a.name.localeCompare(b.name));
	}
}
