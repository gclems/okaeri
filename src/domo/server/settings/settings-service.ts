import type { DomoSetting } from "#/interfaces/settings";
import type { CarService } from "#/server/car/car-service";
import { getDomo } from "#/server/instance";
import {
	findAllSettings,
	findSetting,
	upsertSettings,
} from "#/server/settings/settings-repository";

export class SettingValidationError extends Error {
	constructor(
		message: string,
		public readonly roomIds: string[] = [],
	) {
		super(message);
		this.name = "SettingValidationError";
	}
}

export async function getSettings(): Promise<DomoSetting[]> {
	return findAllSettings();
}

export async function findAllSettingsByKey(): Promise<
	Record<string, DomoSetting>
> {
	return Object.fromEntries(
		(await getSettings()).map((setting) => [setting.key, setting]),
	);
}

export async function findSettingByKey(
	key: string,
): Promise<DomoSetting | null> {
	return await findSetting(key);
}

export async function saveSettings(settings: DomoSetting[]): Promise<void> {
	await upsertSettings(settings);
	(getDomo().homeAssistantService("car") as CarService)?.carSettingChanged();
}
