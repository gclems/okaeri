import type { HassEntities, HassEntity } from "home-assistant-js-websocket";

import type { DomoEntityState, DomoSnapshot } from "../shared/home-assistant";
import {
	HomeAssistantClient,
	type HomeAssistantClientOptions,
} from "./home-assistant-client";
import { LightingService } from "./lighting/lighting-service";

export type DomoListener = (snapshot: DomoSnapshot) => void;

export class Domo {
	public readonly lighting: LightingService;

	private snapshot: DomoSnapshot = {
		connectionState: "idle",
		entities: {},
		error: null,
		revision: 0,
	};

	private readonly listeners = new Set<DomoListener>();
	private startPromise: Promise<void> | null = null;

	private readonly homeAssistant: HomeAssistantClient;

	public constructor(options: HomeAssistantClientOptions) {
		this.homeAssistant = new HomeAssistantClient(options, {
			onConnected: () => {
				this.updateSnapshot({
					connectionState: "connected",
					error: null,
				});
			},

			onDisconnected: () => {
				this.updateSnapshot({
					connectionState: "disconnected",
				});
			},

			onEntitiesChanged: (entities) => {
				this.handleHomeAssistantEntities(entities);
			},

			onError: (error) => {
				console.error("[Domo] Home Assistant error", error);

				this.updateSnapshot({
					connectionState: "error",
					error: this.getErrorMessage(error),
				});
			},
		});

		this.lighting = new LightingService(this.homeAssistant);
	}

	public start(): Promise<void> {
		if (this.snapshot.connectionState === "connected") {
			return Promise.resolve();
		}

		if (this.startPromise) {
			return this.startPromise;
		}

		this.updateSnapshot({
			connectionState: "connecting",
			error: null,
		});

		this.startPromise = this.homeAssistant.connect().finally(() => {
			this.startPromise = null;
		});

		return this.startPromise;
	}

	public stop(): void {
		this.homeAssistant.disconnect();
	}

	public getSnapshot(): DomoSnapshot {
		return this.snapshot;
	}

	public subscribe(listener: DomoListener): () => void {
		this.listeners.add(listener);

		return () => {
			this.listeners.delete(listener);
		};
	}

	private handleHomeAssistantEntities(entities: HassEntities): void {
		/*
		 * Nouveau silo métier.
		 */
		this.lighting.synchronize(entities);

		/*
		 * Snapshot brut temporairement conservé pour les domaines
		 * qui n’ont pas encore été migrés.
		 */
		this.replaceEntities(entities);
	}

	private replaceEntities(entities: HassEntities): void {
		const mappedEntities = Object.fromEntries(
			Object.values(entities).map((entity) => [
				entity.entity_id,
				this.mapEntity(entity),
			]),
		);

		this.updateSnapshot({
			entities: mappedEntities,
			error: null,
		});
	}

	private mapEntity(entity: HassEntity): DomoEntityState {
		return {
			entityId: entity.entity_id,
			state: entity.state,
			attributes: entity.attributes,
			lastChanged: entity.last_changed,
			lastUpdated: entity.last_updated,
		};
	}

	private updateSnapshot(
		changes: Partial<Omit<DomoSnapshot, "revision">>,
	): void {
		this.snapshot = {
			...this.snapshot,
			...changes,
			revision: this.snapshot.revision + 1,
		};

		for (const listener of this.listeners) {
			listener(this.snapshot);
		}
	}

	private getErrorMessage(error: unknown): string {
		return error instanceof Error
			? error.message
			: "Unknown Home Assistant error";
	}
}
