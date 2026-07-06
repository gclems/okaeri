// app/server/functions/lighting.functions.ts
import { createServerFn } from "@tanstack/react-start";

import { LightService } from "../../domo";

const lightService = new LightService();

export const getLightBulbs = createServerFn({ method: "GET" }).handler(
	async () => lightService.getLightBulbs(),
);

export const getLightGroups = createServerFn({ method: "GET" }).handler(
	async () => lightService.getLightGroups(),
);
