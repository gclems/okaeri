import type { HassEntities } from "home-assistant-js-websocket";

import type { DomoServiceSnapshot } from "#/server/domo-service-snapshot";
import type { HomeAssistantClient } from "#/server/home-assistant-client";
import type { HomeAssistantRegistryService } from "#/server/home-assistant-registry/home-assistant-registry-service";

export interface HomeAssistantSynchronizable {
	eventName: string;
	getSnapshot(): DomoServiceSnapshot;
	synchronize(entities: HassEntities): boolean | Promise<boolean>;
}

export abstract class HomeAssistantService<T extends DomoServiceSnapshot>
	implements HomeAssistantSynchronizable
{
	constructor(
		public readonly eventName: string,
		protected readonly homeAssistant: HomeAssistantClient,
		protected readonly registry: HomeAssistantRegistryService,
	) {}

	protected snapshot: T = {} as T;

	public getSnapshot(): T {
		return this.snapshot;
	}

	public abstract synchronize(
		entities: HassEntities,
	): boolean | Promise<boolean>;
}
