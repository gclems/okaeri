// app/okaeri/realtime/use-domo-realtime.ts
import { useEffect } from "react";

import type {
	DomoLightBulbUpdatedEvent,
	DomoLightGroupUpdatedEvent,
} from "#/domo/core/events/domo-event.types";

import { useLightingStore } from "../features/lighting/lighting.store";

type DomoRealtimeEvent =
	| {
			type: "connected";
			payload: {
				at: string;
			};
	  }
	| DomoLightBulbUpdatedEvent
	| DomoLightGroupUpdatedEvent;

export function useDomoRealtime() {
	const { upsertLightBulb, upsertLightGroup } = useLightingStore();

	useEffect(() => {
		const eventSource = new EventSource("/api/realtime");

		eventSource.onmessage = (message) => {
			const event = JSON.parse(message.data) as DomoRealtimeEvent;

			if (event.type === "light.bulb.updated") {
				upsertLightBulb(event.payload);
			} else if (event.type === "light.group.updated") {
				upsertLightGroup(event.payload);
			}
		};

		eventSource.onerror = () => {
			console.warn("Dōmo realtime connection lost");
		};

		return () => {
			eventSource.close();
		};
	}, [upsertLightBulb, upsertLightGroup]);
}
