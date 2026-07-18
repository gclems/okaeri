import { createServerFn } from "@tanstack/react-start";

import {
	findSettingByKeyInputSchema,
	saveSettingsInputSchema,
} from "#/server/settings/settings-schemas";
import {
	SettingValidationError,
	findSettingByKey,
	getSettings,
	saveSettings,
} from "#/server/settings/settings-service";

export const loadSettings = createServerFn({
	method: "GET",
}).handler(async () => {
	return getSettings();
});

export const findSetting = createServerFn({
	method: "GET",
})
	.validator(findSettingByKeyInputSchema)
	.handler(async ({ data }: { data: { key: string } }) => {
		return findSettingByKey(data.key);
	});

export const persistSettings = createServerFn({ method: "POST" })
	.validator(saveSettingsInputSchema)
	.handler(async ({ data }) => {
		try {
			const settings = await saveSettings(data);

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
