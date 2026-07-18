import type { NewSettingRow, SettingRow } from "#/server/db/schema";
import type { Setting } from "#/server/settings/settings-types";

export function settingRowToSetting(row: SettingRow): Setting {
	return {
		key: row.key as string,
		value: row.value as string | null,
	};
}

export function settingToSettingRow(setting: Setting): NewSettingRow {
	return {
		key: setting.key,
		value: setting.value,
	};
}
