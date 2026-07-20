import type { HassEntities, MessageBase } from "home-assistant-js-websocket";

import { CarService } from "#/server/car/car-service";
import type { DomoServiceSnapshot } from "#/server/domo-service-snapshot";
import { EnvironmentService } from "#/server/environment/environment-service";
import {
	HomeAssistantClient,
	type HomeAssistantClientOptions,
} from "#/server/home-assistant-client";
import { HomeAssistantRegistryService } from "#/server/home-assistant-registry/home-assistant-registry-service";
import type { HomeAssistantSynchronizable } from "#/server/home-assistant-service";
import { LightingService } from "#/server/lighting/lighting-service";
import { SunService } from "#/server/sun/sun-service";
import type { DomoSnapshot } from "#/shared/home-assistant-types";

export type DomoListener = (snapshot: DomoSnapshot) => void;

export type DomoServiceListener = (
	snapshots: Record<string, DomoServiceSnapshot>,
) => void;

export class Domo {
	public readonly homeAssistantRegistry: HomeAssistantRegistryService;
	public readonly sun: SunService;

	private readonly homeAssistant: HomeAssistantClient;
	private readonly homeAssistantServices: HomeAssistantSynchronizable[];

	private snapshot: DomoSnapshot = {
		connectionState: "idle",
		entities: {},
		error: null,
		revision: 0,
	};

	private readonly listeners = new Set<DomoListener>();
	private readonly serviceSnapshotsListeners = new Set<DomoServiceListener>();

	private startPromise: Promise<void> | null = null;
	private homeAssistantRegistryReady = false;
	private pendingHomeAssistantEntities: HassEntities | null = null;

	public constructor(options: HomeAssistantClientOptions) {
		this.homeAssistant = new HomeAssistantClient(options, {
			onDisconnected: () => {
				this.updateSnapshot({
					connectionState: "disconnected",
				});
			},

			onEntitiesChanged: (entities) => {
				this.handleHomeAssistantStatesUpdate(entities);
			},

			onError: (error) => {
				this.handleHomeAssistantError(error);
			},
		});

		this.homeAssistantRegistry = new HomeAssistantRegistryService(
			this.homeAssistant,
		);

		this.homeAssistantServices = [
			new LightingService(this.homeAssistant, this.homeAssistantRegistry),
			new EnvironmentService(this.homeAssistant, this.homeAssistantRegistry),
			new CarService(this.homeAssistant, this.homeAssistantRegistry),
		];

		this.sun = new SunService();
	}

	public async start(): Promise<void> {
		if (this.snapshot.connectionState === "connected") {
			return Promise.resolve();
		}

		if (this.startPromise) {
			return this.startPromise;
		}

		this.startPromise = this.initialize().finally(() => {
			this.startPromise = null;
		});

		return this.startPromise;
	}

	public stop(): void {
		this.homeAssistant.disconnect();

		this.updateSnapshot({
			connectionState: "idle",
			error: null,
		});
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

	public getServicesSnapshot(): Record<string, DomoServiceSnapshot> {
		const snapshots: Record<string, DomoServiceSnapshot> = {};

		for (const service of this.homeAssistantServices) {
			snapshots[service.eventName] = service.getSnapshot();
		}

		return snapshots;
	}

	public subscribeToServiceSnapshots(listener: DomoServiceListener): () => void {
		this.serviceSnapshotsListeners.add(listener);

		return () => {
			this.serviceSnapshotsListeners.delete(listener);
		};
	}

	public sendHomeAssistantCommand<TResult>(
		message: MessageBase,
	): Promise<TResult> {
		return this.homeAssistant.sendCommand<TResult>(message);
	}

	public homeAssistantService(name: string) {
		return this.homeAssistantServices.find(
			(service) => service.eventName === name,
		);
	}

	public async restart() {
		this.stop();
		await this.start();
	}

	private async initialize(): Promise<void> {
		this.updateSnapshot({
			connectionState: "connecting",
			error: null,
		});

		this.homeAssistantRegistryReady = false;

		try {
			await this.homeAssistant.connect();

			await this.homeAssistantRegistry.load();

			this.homeAssistantRegistryReady = true;

			if (this.pendingHomeAssistantEntities) {
				const entities = this.pendingHomeAssistantEntities;
				this.pendingHomeAssistantEntities = null;

				this.synchronizeHomeAssistantServices(entities);
			}

			await this.homeAssistant.subscribeToEntities();

			this.updateSnapshot({
				connectionState: "connected",
				error: null,
			});
		} catch (error) {
			this.homeAssistantRegistryReady = false;
			this.handleHomeAssistantError(error);

			throw error;
		}
	}

	private handleHomeAssistantStatesUpdate(entities: HassEntities): void {
		if (!this.homeAssistantRegistryReady) {
			this.pendingHomeAssistantEntities = entities;
			return;
		}

		this.synchronizeHomeAssistantServices(entities);
	}

	private synchronizeHomeAssistantServices(entities: HassEntities): void {
		const updatedServices = this.homeAssistantServices.filter((service) =>
			service.synchronize(entities),
		);

		if (updatedServices.length === 0) {
			return;
		}

		const snapshots: Record<string, DomoServiceSnapshot> = {};

		updatedServices.forEach((service) => {
			snapshots[service.eventName] = service.getSnapshot();
		});

		this.serviceSnapshotsListeners.forEach((listener) => {
			listener(snapshots);
		});
	}

	private handleHomeAssistantError(error: unknown): void {
		console.error("[Domo] Home Assistant error", error);

		this.updateSnapshot({
			connectionState: "error",
			error: this.getErrorMessage(error),
		});
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
