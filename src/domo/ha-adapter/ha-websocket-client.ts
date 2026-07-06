import { haGet } from "./ha-client";
import { useHaStore } from "./ha-store";
import type { HaEntity } from "./ha-types";

const HA_WS_URL = import.meta.env.VITE_HA_WS_URL;
const HA_TOKEN = import.meta.env.VITE_HA_TOKEN;

export async function initHomeAssistantWebSocket() {
	const states = await haGet<HaEntity[]>("states");
	useHaStore.getState().setEntities(states);

	const socket = new WebSocket(HA_WS_URL);

	socket.addEventListener("message", (event) => {
		const message = JSON.parse(event.data);

		if (message.type === "auth_required") {
			socket.send(
				JSON.stringify({
					type: "auth",
					access_token: HA_TOKEN,
				}),
			);
		}

		if (message.type === "auth_ok") {
			useHaStore.getState().setConnected(true);
			socket.send(
				JSON.stringify({
					id: 1,
					type: "subscribe_events",
					event_type: "state_changed",
				}),
			);
		}

		if (message.type === "event") {
			const newState = message.event.data.new_state as HaEntity | null;

			if (newState) {
				useHaStore.getState().updateEntity(newState);
			}
		}
	});

	socket.addEventListener("close", () => {
		useHaStore.getState().setConnected(false);
	});

	socket.addEventListener("error", () => {
		useHaStore.getState().setConnected(false);
	});

	return socket;
}
