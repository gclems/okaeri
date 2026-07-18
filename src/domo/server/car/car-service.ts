import type { HomeAssistantClient } from "#/server/home-assistant-client";
import type { RegistryService } from "#/server/registry/registry-service";
import type { Car, DomoCarSnapshot } from "#/shared/car-types";

export type CarListener = (snapshot: DomoCarSnapshot) => void;

export class CarService {
	private snapshot: DomoCarSnapshot = {
		car: null,
		revision: 0,
	};

	private readonly listeners = new Set<CarListener>();

	public constructor(
		private readonly homeAssistant: HomeAssistantClient,
		private readonly registry: RegistryService,
	) {}

	public getSnapshot(): DomoCarSnapshot {
		return this.snapshot;
	}

	public getCar(): Car | null {
		return this.snapshot.car;
	}

	public subscribe(listener: CarListener): () => void {
		this.listeners.add(listener);

		return () => {
			this.listeners.delete(listener);
		};
	}

	public synchronize(snapshot: DomoCarSnapshot): void {}

	private emit(): void {
		for (const listener of this.listeners) {
			listener(this.snapshot);
		}
	}
}
