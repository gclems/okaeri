import type { AreaRegistryEntry, HomeAssistantArea } from "#/shared/registry";

import type { HomeAssistantClient } from "../home-assistant-client";
import { mapHomeAssistantArea } from "./registry-mapper";

export class RegistryService {
	private areas: HomeAssistantArea[] | null = null;
	private areasPromise: Promise<HomeAssistantArea[]> | null = null;
	private areasLoadedAt = 0;

	public constructor(private readonly homeAssistant: HomeAssistantClient) {}

	public async getAreas({
		refresh = false,
	}: {
		refresh?: boolean;
	} = {}): Promise<HomeAssistantArea[]> {
		const expired = Date.now() - this.areasLoadedAt > 5 * 60_000;

		if (!refresh && !expired && this.areas !== null) {
			return this.areas;
		}

		if (this.areasPromise) {
			return this.areasPromise;
		}

		this.areasPromise = this.fetchAreas()
			.then((areas) => {
				this.areas = areas;
				this.areasLoadedAt = Date.now();

				return areas;
			})
			.finally(() => {
				this.areasPromise = null;
			});

		return this.areasPromise;
	}

	private async fetchAreas(): Promise<HomeAssistantArea[]> {
		const response = await this.homeAssistant.sendCommand<unknown>({
			type: "config/area_registry/list",
		});

		return Array.isArray(response)
			? response.map((area) => mapHomeAssistantArea(area as AreaRegistryEntry))
			: [];
	}
}
