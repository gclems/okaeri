import { createServerFn } from "@tanstack/react-start";

import { getDomo } from "#/server/instance";

export const restartDomo = createServerFn({
	method: "POST",
}).handler(async () => {
	const domo = getDomo();

	await domo.restart();

	return {
		success: true,
	};
});
