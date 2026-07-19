import type { DomoServiceSnapshot } from "#/server/domo-service-snapshot";

type SseEvent = Record<string, DomoServiceSnapshot>;

type CreateSseResponseOptions = {
	subscribe: (send: (event: SseEvent) => void) => () => void;
	initialEvent?: () => SseEvent;
	heartbeatInterval?: number;
};

export function createSseResponse(
	request: Request,
	{
		subscribe,
		initialEvent,
		heartbeatInterval = 15_000,
	}: CreateSseResponseOptions,
): Response {
	const encoder = new TextEncoder();

	let dispose = () => {};

	const stream = new ReadableStream<Uint8Array>({
		start(controller) {
			let disposed = false;

			const send = (event: SseEvent) => {
				if (disposed) return;

				controller.enqueue(encoder.encode(formatSseEvent(event)));
			};

			const unsubscribe = subscribe(send);

			const heartbeat = setInterval(() => {
				if (!disposed) {
					controller.enqueue(encoder.encode(": keep-alive\n\n"));
				}
			}, heartbeatInterval);

			const handleAbort = () => {
				dispose();
			};

			dispose = () => {
				if (disposed) return;
				disposed = true;

				clearInterval(heartbeat);
				unsubscribe();

				request.signal.removeEventListener("abort", handleAbort);
			};

			request.signal.addEventListener("abort", handleAbort, { once: true });

			if (initialEvent) {
				send(initialEvent());
			}
		},

		cancel() {
			dispose();
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache, no-transform",
			"X-Accel-Buffering": "no",
		},
	});
}

function formatSseEvent(snapshots: SseEvent): string {
	const lines: string[] = [];

	lines.push(`data: ${JSON.stringify({ snapshots })}`);
	lines.push("", "");

	return lines.join("\n");
}
