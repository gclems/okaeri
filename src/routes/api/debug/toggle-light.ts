// app/routes/api/debug/toggle-light.ts

import { createFileRoute } from "@tanstack/react-router";

import { domoEventBus } from "../../../domo";

let isOn = false;

export const ServerRoute = createFileRoute("/api/debug/toggle-light")({
	server: {
		handlers: {
			POST: async () => {
				isOn = !isOn;

				domoEventBus.emitEvent({
					type: "light.group.updated",
					payload: {
						entityId: "light.demo_lamp",
						name: "Lampe Démo",
						isOn,
						brightness: isOn ? 75 : null,
						colorMode: isOn ? "brightness" : null,
						lastChanged: new Date().toISOString(),

						color: [218, 163, 32],
						raw: {
							entity_id: "light.demo_lamp",
							attributes: {},
							last_changed: "",
							last_updated: "string",
							state: isOn ? "on" : "off",
						},
					},
				});

				return Response.json({ ok: true, isOn });
			},
		},
	},
});
