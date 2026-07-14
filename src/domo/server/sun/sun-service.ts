import { Cron } from "croner";

import { fetchSun } from "#/server/sun/met-no-sun-client";
import { mapSun } from "#/server/sun/sun-mapper";
import type { Sun } from "#/shared/sun-types";

export class SunService {
	private sun: Sun | null = null;
	private job: Cron | null = null;

	public async start(): Promise<void> {
		// Chargement immédiat au démarrage du serveur.
		await this.refresh();

		this.job = new Cron("0 0 * * *", { timezone: "Europe/Paris" }, () => {
			void this.refresh().catch((error) => {
				console.error("[SunService] Daily refresh failed", error);
			});
		});
	}

	public stop(): void {
		this.job?.stop();
		this.job = null;
	}

	public getSnapshot(): Sun | null {
		return this.sun;
	}

	private async refresh(): Promise<void> {
		const today = new Date();
		const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

		this.sun = mapSun(today, await fetchSun(today), await fetchSun(tomorrow));
	}
}
