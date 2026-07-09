import { getDomoServerConfig } from "./config";
import { Domo } from "./domo";

declare global {
	var __okaeriDomo: Domo | undefined;
}

export function getDomo(): Domo {
	if (!globalThis.__okaeriDomo) {
		const config = getDomoServerConfig();

		globalThis.__okaeriDomo = new Domo({
			url: config.homeAssistantUrl,
			token: config.homeAssistantToken,
		});
	}

	return globalThis.__okaeriDomo;
}
