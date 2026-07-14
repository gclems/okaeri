import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getDomo } from "../instance";

const lightIdSchema = z.string().startsWith("light.");

const lightCommandSchema = z.object({
	entityId: lightIdSchema,
});

const setBrightnessSchema = z.object({
	entityId: lightIdSchema,
	brightness: z.number().min(0).max(1),
});

const setColorSchema = z.object({
	entityId: lightIdSchema,

	color: z.object({
		red: z.number().int().min(0).max(255),
		green: z.number().int().min(0).max(255),
		blue: z.number().int().min(0).max(255),
	}),
});

export const getLightingSnapshot = createServerFn({
	method: "POST",
}).handler(async () => {
	const domo = getDomo();

	await domo.whenReady();

	return domo.lighting.getSnapshot();
});

export const turnOnLight = createServerFn({
	method: "POST",
})
	.validator(lightCommandSchema)
	.handler(async ({ data }) => {
		const domo = getDomo();

		await domo.whenReady();
		await domo.lighting.turnOn(data.entityId);

		return {
			success: true,
		};
	});

export const turnOffLight = createServerFn({
	method: "POST",
})
	.validator(lightCommandSchema)
	.handler(async ({ data }) => {
		const domo = getDomo();

		await domo.whenReady();
		await domo.lighting.turnOff(data.entityId);

		return {
			success: true,
		};
	});

export const toggleLight = createServerFn({
	method: "POST",
})
	.validator(lightCommandSchema)
	.handler(async ({ data }) => {
		const domo = getDomo();

		await domo.whenReady();
		await domo.lighting.toggle(data.entityId);

		return {
			success: true,
		};
	});

export const setLightBrightness = createServerFn({
	method: "POST",
})
	.validator(setBrightnessSchema)
	.handler(async ({ data }) => {
		const domo = getDomo();

		await domo.whenReady();

		await domo.lighting.setBrightness(data.entityId, data.brightness);

		return {
			success: true,
		};
	});

export const setLightColor = createServerFn({
	method: "POST",
})
	.validator(setColorSchema)
	.handler(async ({ data }) => {
		const domo = getDomo();

		await domo.whenReady();

		await domo.lighting.setColor(data.entityId, data.color);

		return {
			success: true,
		};
	});
