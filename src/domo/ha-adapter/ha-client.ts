import { joinURL } from "ufo";

import type { HaEntity } from "./ha-types";

const HA_URL = import.meta.env.VITE_HA_URL;
const HA_TOKEN = import.meta.env.VITE_HA_TOKEN;

export class HaClient {
	async getStates(): Promise<HaEntity[]> {
		const response = await fetch(joinURL(HA_URL, "api", "states"), {
			headers: {
				Authorization: `Bearer ${HA_TOKEN}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Home Assistant error: ${response.status}`);
		}

		return response.json();
	}
}
