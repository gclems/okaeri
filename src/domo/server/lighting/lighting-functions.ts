import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { LightingService } from "#/server/lighting/lighting-service";

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

const setColorAndBrightnessSchema = z.object({
	entityId: lightIdSchema,

	color: z.object({
		red: z.number().int().min(0).max(255),
		green: z.number().int().min(0).max(255),
		blue: z.number().int().min(0).max(255),
	}),

	brightness: z.number().min(0).max(1),
});

export const turnOnLight = createServerFn({
	method: "POST",
})
	.validator(lightCommandSchema)
	.handler(async ({ data }) => {
		const domo = getDomo();

		await domo.start();
		await (domo.homeAssistantService("lighting") as LightingService)?.turnOn(
			data.entityId,
		);

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

		await domo.start();
		await (domo.homeAssistantService("lighting") as LightingService)?.turnOff(
			data.entityId,
		);

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

		await domo.start();
		await (domo.homeAssistantService("lighting") as LightingService)?.toggle(
			data.entityId,
		);

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

		await domo.start();

		await (
			domo.homeAssistantService("lighting") as LightingService
		).setBrightness(data.entityId, data.brightness);

		return {
			success: true,
		};
	});

export const setLightColorAndBrightness = createServerFn({
	method: "POST",
})
	.validator(setColorAndBrightnessSchema)
	.handler(async ({ data }) => {
		const domo = getDomo();

		await domo.start();

		await (
			domo.homeAssistantService("lighting") as LightingService
		).setColorAndBrightness(data.entityId, data.color, data.brightness);

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

		await domo.start();

		await (domo.homeAssistantService("lighting") as LightingService).setColor(
			data.entityId,
			data.color,
		);

		return {
			success: true,
		};
	});
