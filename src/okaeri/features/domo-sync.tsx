import { useEffect } from "react";

import type { DomoServiceSnapshot } from "#/server/domo-service-snapshot";
import { useDomoStore } from "@/features/domo-store";

export function useDomoSync() {
	useEffect(() => {
		useDomoStore.getState().setConnectionState("connecting");

		const eventSource = new EventSource("/api/events");

		eventSource.onopen = () => {
			useDomoStore.getState().setConnectionState("connected");
		};

		eventSource.onmessage = (event) => {
			const { snapshots } = JSON.parse(event.data) as {
				snapshots: Record<string, DomoServiceSnapshot>;
			};

			for (const [type, snapshot] of Object.entries(snapshots)) {
				useDomoStore.getState().setSnapshot(type, snapshot);
			}
		};

		eventSource.onerror = () => {
			useDomoStore.getState().setConnectionState("error");
		};

		return () => {
			eventSource.close();
		};
	}, []);
}

// function useLightingSync() {
// 	useEffect(() => {
// 		useLightingStore.getState().setConnectionState("connecting");

// 		const eventSource = new EventSource("/api/lighting/events");

// 		eventSource.onopen = () => {
// 			useLightingStore.getState().setConnectionState("connected");
// 		};

// 		eventSource.onmessage = (event) => {
// 			const snapshot = JSON.parse(event.data) as DomoLightingSnapshot;

// 			useLightingStore.getState().setSnapshot(snapshot);
// 		};

// 		eventSource.onerror = () => {
// 			useLightingStore.getState().setConnectionState("error");
// 		};

// 		return () => {
// 			eventSource.close();
// 		};
// 	}, []);
// }

// function useEnvironmentSync() {
// 	useEffect(() => {
// 		useEnvironmentStore.getState().setConnectionState("connecting");

// 		const eventSource = new EventSource("/api/environment/events");

// 		eventSource.onopen = () => {
// 			useEnvironmentStore.getState().setConnectionState("connected");
// 		};

// 		eventSource.onmessage = (event) => {
// 			const snapshot = JSON.parse(event.data) as DomoEnvironmentSnapshot;

// 			useEnvironmentStore.getState().setSnapshot(snapshot);
// 		};

// 		eventSource.onerror = () => {
// 			useEnvironmentStore.getState().setConnectionState("error");
// 		};

// 		return () => {
// 			eventSource.close();
// 		};
// 	}, []);
// }

// function useCarSync() {
// 	useEffect(() => {
// 		useCarStore.getState().setConnectionState("connecting");

// 		const eventSource = new EventSource("/api/car/events");

// 		eventSource.onopen = () => {
// 			useCarStore.getState().setConnectionState("connected");
// 		};

// 		eventSource.onmessage = (event) => {
// 			const snapshot = JSON.parse(event.data) as DomoCarSnapshot;

// 			useCarStore.getState().setSnapshot(snapshot);
// 		};

// 		eventSource.onerror = () => {
// 			useCarStore.getState().setConnectionState("error");
// 		};

// 		return () => {
// 			eventSource.close();
// 		};
// 	}, []);
// }
