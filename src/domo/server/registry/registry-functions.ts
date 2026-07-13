import { createServerFn } from "@tanstack/react-start";

import { getDomo } from "../instance";

export const getHomeAssistantAreas = createServerFn({
	method: "POST",
}).handler(async () => {
	const domo = getDomo();

	await domo.start();

	return domo.registry.getAreas();
});
