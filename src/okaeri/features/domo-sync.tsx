import { useEffect } from "react";

import type { DomoEnvironmentSnapshot } from "#/shared/environment-types";
import type { DomoLightingSnapshot } from "#/shared/lighting-types";
import { useEnvironmentStore } from "@/features/environment/environment.store";
import { useLightingStore } from "@/features/lighting/lighting.store";

export function useDomoSync() {
	useLightingSync();
	useEnvironmentSync();
}

function useLightingSync() {
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

function useEnvironmentSync() {
	useEffect(() => {
		useEnvironmentStore.getState().setConnectionState("connecting");

		const eventSource = new EventSource("/api/environment/events");

		eventSource.onopen = () => {
			useEnvironmentStore.getState().setConnectionState("connected");
		};

		eventSource.onmessage = (event) => {
			const snapshot = JSON.parse(event.data) as DomoEnvironmentSnapshot;

			useEnvironmentStore.getState().setSnapshot(snapshot);
		};

		eventSource.onerror = () => {
			useEnvironmentStore.getState().setConnectionState("error");
		};

		return () => {
			eventSource.close();
		};
	}, []);
}
