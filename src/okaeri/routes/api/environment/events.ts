import { createFileRoute } from "@tanstack/react-router";

import { getDomo } from "#/server/instance";

export const Route = createFileRoute("/api/environment/events")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const domo = getDomo();

				await domo.whenReady();

				const encoder = new TextEncoder();
				let cleanup = () => {};

				const stream = new ReadableStream<Uint8Array>({
					start(controller) {
						let closed = false;
						let heartbeat: ReturnType<typeof setInterval> | undefined;

						const sendSnapshot = () => {
							const snapshot = domo.environment.getSnapshot();

							controller.enqueue(
								encoder.encode(
									`id: ${snapshot.revision}\ndata: ${JSON.stringify(snapshot)}\n\n`,
								),
							);
						};

						const unsubscribe = domo.environment.subscribe(sendSnapshot);

						cleanup = () => {
							if (closed) {
								return;
							}

							closed = true;
							unsubscribe();

							if (heartbeat) {
								clearInterval(heartbeat);
							}

							request.signal.removeEventListener("abort", handleAbort);
						};

						const handleAbort = () => {
							cleanup();
							controller.close();
						};

						request.signal.addEventListener("abort", handleAbort, {
							once: true,
						});

						// Envoie immédiatement le snapshot courant.
						sendSnapshot();

						// Évite que certains proxies ferment une connexion inactive.
						heartbeat = setInterval(() => {
							controller.enqueue(encoder.encode(": keep-alive\n\n"));
						}, 15_000);
					},

					cancel() {
						cleanup();
					},
				});

				return new Response(stream, {
					headers: {
						"Content-Type": "text/event-stream",
						"Cache-Control": "no-cache, no-transform",
						"X-Accel-Buffering": "no",
					},
				});
			},
		},
	},
});
