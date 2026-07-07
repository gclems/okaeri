// app/routes/api/realtime.ts

import { createFileRoute } from "@tanstack/react-router";

import { domoEventBus } from "../../domo";

export const Route = createFileRoute("/api/realtime")({
	server: {
		handlers: {
			GET: async () => {
				const stream = new ReadableStream({
					start(controller) {
						const encoder = new TextEncoder();

						const send = (event: unknown) => {
							controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
						};

						send({
							type: "connected",
							payload: {
								at: new Date().toISOString(),
							},
						});

						const unsubscribe = domoEventBus.onEvent(send);

						const heartbeat = setInterval(() => {
							controller.enqueue(encoder.encode(`: heartbeat\n\n`));
						}, 30000);

						return () => {
							clearInterval(heartbeat);
							unsubscribe();
						};
					},
				});

				return new Response(stream, {
					headers: {
						"Content-Type": "text/event-stream",
						"Cache-Control": "no-cache, no-transform",
						Connection: "keep-alive",
					},
				});
			},
		},
	},
});
