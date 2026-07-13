import { useEffect } from "react";

import type { DomoLightingSnapshot } from "#/shared/lighting-types";
import { useLightingStore } from "@/features/lighting/lighting.store";

export function useDomoSync() {
	useEffect(() => {
		useLightingStore.getState().setConnectionState("connecting");

		const eventSource = new EventSource("/api/lighting/events");

		eventSource.onopen = () => {
			useLightingStore.getState().setConnectionState("connected");
		};

		eventSource.onmessage = (event) => {
			const snapshot = JSON.parse(event.data) as DomoLightingSnapshot;

			useLightingStore.getState().setSnapshot(snapshot);
		};

		eventSource.onerror = () => {
			useLightingStore.getState().setConnectionState("error");
		};

		return () => {
			eventSource.close();
		};
	}, []);
}
