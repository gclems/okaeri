import { createServerFn } from "@tanstack/react-start";

import { getDomo } from "../instance";

export const getHomeAssistantAreas = createServerFn({
	method: "GET",
}).handler(async () => {
	const domo = getDomo();

	await domo.whenReady();

	return Array.from(domo.registry.getAreas().values());
});

export const getHomeAssistantDevices = createServerFn({
	method: "GET",
}).handler(async () => {
	const domo = getDomo();

	await domo.whenReady();

	return Array.from(domo.registry.getDevices().values());
});
