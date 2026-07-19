import { getDomo } from "#/server/instance";
import {
	findAllSettings,
	findSetting,
	upsertSettings,
} from "#/server/settings/settings-repository";
import type { Setting } from "#/server/settings/settings-types";

export class SettingValidationError extends Error {
	constructor(
		message: string,
		public readonly roomIds: string[] = [],
	) {
		super(message);
		this.name = "SettingValidationError";
	}
}

export async function getSettings(): Promise<Setting[]> {
	return findAllSettings();
}

export async function findAllSettingsByKey(): Promise<Record<string, Setting>> {
	return Object.fromEntries(
		(await getSettings()).map((setting) => [setting.key, setting]),
	);
}

export async function findSettingByKey(key: string): Promise<Setting | null> {
	return await findSetting(key);
}

export async function saveSettings(settings: Setting[]): Promise<void> {
	await upsertSettings(settings);
	getDomo().car.carSettingChanged();
}
