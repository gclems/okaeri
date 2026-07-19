import { useEffect } from "react";

import type { DomoCarSnapshot } from "#/shared/car-types";
import type { DomoEnvironmentSnapshot } from "#/shared/environment-types";
import type { DomoLightingSnapshot } from "#/shared/lighting-types";
import { useCarStore } from "@/features/car/car.store";
import { useEnvironmentStore } from "@/features/environment/environment.store";
import { useLightingStore } from "@/features/lighting/lighting.store";

export function useDomoSync() {
	useLightingSync();
	useEnvironmentSync();
	useCarSync();
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

function useCarSync() {
	useEffect(() => {
		useCarStore.getState().setConnectionState("connecting");

		const eventSource = new EventSource("/api/car/events");

		eventSource.onopen = () => {
			useCarStore.getState().setConnectionState("connected");
		};

		eventSource.onmessage = (event) => {
			const snapshot = JSON.parse(event.data) as DomoCarSnapshot;

			useCarStore.getState().setSnapshot(snapshot);
		};

		eventSource.onerror = () => {
			useCarStore.getState().setConnectionState("error");
		};

		return () => {
			eventSource.close();
		};
	}, []);
}
