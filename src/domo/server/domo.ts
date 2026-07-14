import type {
	HassEntities,
	HassEntity,
	MessageBase,
} from "home-assistant-js-websocket";

import { EnvironmentService } from "#/server/environment/environment-service";
import {
	HomeAssistantClient,
	type HomeAssistantClientOptions,
} from "#/server/home-assistant-client";
import { LightingService } from "#/server/lighting/lighting-service";
import { RegistryService } from "#/server/registry/registry-service";
import { SunService } from "#/server/sun/sun-service";
import type {
	DomoEntityState,
	DomoSnapshot,
} from "#/shared/home-assistant-types";

export type DomoListener = (snapshot: DomoSnapshot) => void;

export class Domo {
	public readonly registry: RegistryService;
	public readonly lighting: LightingService;
	public readonly environment: EnvironmentService;
	public readonly sun: SunService;

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
			onConnectionReady: async () => {
				await this.registry.load();
			},

			onConnected: () => {
				this.updateSnapshot({
					connectionState: "connected",
					error: null,
				});
			},

			onDisconnected: async () => {
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

		this.registry = new RegistryService(this.homeAssistant);
		this.lighting = new LightingService(this.homeAssistant, this.registry);
		this.environment = new EnvironmentService(this.homeAssistant, this.registry);
		this.sun = new SunService();
	}

	public async start(): Promise<void> {
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

		this.startPromise = this.homeAssistant
			.connect(async () => {
				await this.registry.load();
			})
			.finally(() => {
				this.startPromise = null;
			});

		return this.startPromise;
	}

	public async whenReady(): Promise<void> {
		if (this.snapshot.connectionState === "connected") {
			return;
		}

		if (this.startPromise) {
			return this.startPromise;
		}

		throw new Error(
			this.snapshot.error ?? "Domo is not connected to Home Assistant.",
		);
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

	public async sendHomeAssistantCommand<TResult>(
		message: MessageBase,
	): Promise<TResult> {
		return this.homeAssistant.sendCommand<TResult>(message);
	}

	private handleHomeAssistantEntities(entities: HassEntities): void {
		this.lighting.synchronize(entities);
		this.environment.synchronize(entities);

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
