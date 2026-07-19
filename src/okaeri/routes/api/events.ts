import { createFileRoute } from "@tanstack/react-router";

import { getDomo } from "#/server/instance";
import { createSseResponse } from "@/helpers/sse";

export const Route = createFileRoute("/api/events")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const domo = getDomo();
				await domo.start();

				return createSseResponse(request, {
					subscribe: (send) => domo.subscribeToServiceSnapshots(send),
					initialEvent: () => domo.getServicesSnapshot(),
				});
			},
		},
	},
});
