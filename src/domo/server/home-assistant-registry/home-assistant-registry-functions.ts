import { createServerFn } from "@tanstack/react-start";

import { getDomo } from "../instance";

export const getHomeAssistantEntities = createServerFn({
	method: "GET",
}).handler(async () => {
	const domo = getDomo();

	await domo.start();

	return Array.from(domo.homeAssistantRegistry.entities.values());
});

export const getHomeAssistantDevices = createServerFn({
	method: "GET",
}).handler(async () => {
	const domo = getDomo();

	await domo.start();

	return Array.from(domo.homeAssistantRegistry.devices.values());
});

export const getHomeAssistantAreas = createServerFn({
	method: "GET",
}).handler(async () => {
	const domo = getDomo();

	await domo.start();

	return Array.from(domo.homeAssistantRegistry.areas.values());
});
