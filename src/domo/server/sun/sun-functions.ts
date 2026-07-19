import { createServerFn } from "@tanstack/react-start";

import { getDomo } from "#/server/instance";

export const loadSun = createServerFn({
	method: "GET",
}).handler(async () => {
	const domo = getDomo();

	await domo.start();

	return domo.sun.getSnapshot();
});
