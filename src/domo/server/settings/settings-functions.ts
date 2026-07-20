import { createServerFn } from "@tanstack/react-start";

import { getDomo } from "#/server/instance";
import {
	SettingValidationError,
	findSettingByKey,
	getSettings,
	saveSettings,
} from "#/server/settings/settings-service";
import {
	findSettingByKeyInputSchema,
	saveSettingsInputSchema,
} from "#/server/settings/settings-validation";

export const loadSettings = createServerFn({
	method: "GET",
}).handler(async () => {
	return getSettings();
});

export const findSetting = createServerFn({
	method: "GET",
})
	.validator(findSettingByKeyInputSchema)
	.handler(async ({ data }) => {
		return findSettingByKey(data.key);
	});

export const persistSettings = createServerFn({ method: "POST" })
	.validator(saveSettingsInputSchema)
	.handler(async ({ data }) => {
		try {
			const settings = await saveSettings(data);

			const domo = getDomo();
			if (domo.getSnapshot().connectionState === "connected") {
				domo.synchronizeHomeAssistantServices();
			}

			return {
				success: true as const,
				settings,
			};
		} catch (error) {
			if (error instanceof SettingValidationError) {
				return {
					success: false as const,
					error: {
						code: "SETTINGS_VALIDATION_ERROR" as const,
						message: error.message,
					},
				};
			}

			throw error;
		}
	});
