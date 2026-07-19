import { createFileRoute } from "@tanstack/react-router";

import { getDomo } from "#/server/instance";
import type { DomoLightingSnapshot } from "#/server/lighting/lighting-service";
import { createSseResponse } from "@/helpers/sse";

export const Route = createFileRoute("/api/lighting/events")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const domo = getDomo();
				await domo.start();

				return createSseResponse(request, {
					subscribe: (send) =>
						domo.lighting.subscribe(() => {
							send({
								id: domo.lighting.getSnapshot().revision,
								event: "lighting.updated",
								data: serializeLightingSnapshot(domo.lighting.getSnapshot()),
							});
						}),

					initialEvent: () => {
						const snapshot = domo.lighting.getSnapshot();

						return {
							id: snapshot.revision,
							event: "lighting.updated",
							data: serializeLightingSnapshot(snapshot),
						};
					},
				});
			},
		},
	},
});

function serializeLightingSnapshot(snapshot: DomoLightingSnapshot) {
	return {
		lights: Array.from(snapshot.lights.values()),
		lightGroups: Array.from(snapshot.lightGroups.values()),
	};
}
