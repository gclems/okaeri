import { Cron } from "croner";

import type { DomoSun } from "#/interfaces/sun";
import { fetchSun } from "#/server/sun/met-no-sun-client";
import { mapSun } from "#/server/sun/sun-mapper";

export class SunService {
	private sun: DomoSun | null = null;
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

	public getSnapshot(): DomoSun | null {
		return this.sun;
	}

	private async refresh(): Promise<void> {
		const today = new Date();

		this.sun = mapSun(today, await fetchSun(today));
	}
}
