import type { DomoSetting } from "#/interfaces/settings";
import type { NewSettingRow, SettingRow } from "#/server/db/schema";

export function settingRowToSetting(row: SettingRow): DomoSetting {
	return {
		key: row.key as string,
		value: row.value as string | null,
	};
}

export function settingToSettingRow(setting: DomoSetting): NewSettingRow {
	return {
		key: setting.key,
		value: setting.value,
	};
}
