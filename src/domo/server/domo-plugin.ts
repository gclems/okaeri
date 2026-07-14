import { getDomo } from "#/server/instance";

const RETRY_DELAY_MS = 5_000;

interface NitroApp {
	hooks: {
		hook(name: "close", handler: () => void): void;
	};
}

type RetryTimer = ReturnType<typeof setTimeout> & {
	unref?: () => void;
};

export default async function domoPlugin(nitroApp: NitroApp): Promise<void> {
	if (process.env.TSS_PRERENDERING === "true") {
		return;
	}

	const domo = getDomo();
	let retryTimer: RetryTimer | undefined;
	let startAttempt: Promise<void> | null = null;
	let stopping = false;

	const start = () => {
		if (stopping || startAttempt) {
			return;
		}

		startAttempt = domo
			.start()
			.catch((error: unknown) => {
				if (stopping) {
					return;
				}

				console.warn(
					`[Domo] Startup failed. Retrying in ${RETRY_DELAY_MS / 1_000}s.`,
					error,
				);

				retryTimer = setTimeout(start, RETRY_DELAY_MS) as RetryTimer;
				retryTimer.unref?.();
			})
			.finally(() => {
				startAttempt = null;
			});
	};

	start();
	await domo.sun.start();

	nitroApp.hooks.hook("close", () => {
		stopping = true;

		if (retryTimer) {
			clearTimeout(retryTimer);
		}

		domo.sun.stop();
		domo.stop();
	});
}
