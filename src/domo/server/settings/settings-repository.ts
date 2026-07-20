import { eq, inArray } from "drizzle-orm";

import type { DomoSetting } from "#/interfaces/settings";
import { db } from "#/server/db/client";
import { settingTable } from "#/server/db/schema";
import { settingRowToSetting } from "#/server/settings/settings-mapper";

export async function findAllSettings(): Promise<DomoSetting[]> {
	const rows = await db.select().from(settingTable).orderBy(settingTable.key);

	return rows.map(settingRowToSetting);
}

export async function findSetting(key: string): Promise<DomoSetting | null> {
	const row = await db
		.select()
		.from(settingTable)
		.where(eq(settingTable.key, key))
		.get();
	return row ? settingRowToSetting(row) : null;
}

export async function upsertSettings(settings: DomoSetting[]): Promise<void> {
	const now = new Date();
	db.transaction((transaction) => {
		const keys = settings.map((setting) => setting.key);

		const existingSettings =
			keys.length > 0
				? transaction
						.select()
						.from(settingTable)
						.where(inArray(settingTable.key, keys))
						.all()
				: [];

		const createdAtByKey = new Map(
			existingSettings.map((row) => [row.key, row.createdAt]),
		);

		transaction.delete(settingTable).where(inArray(settingTable.key, keys)).run();

		transaction
			.insert(settingTable)
			.values(
				settings.map((setting) => ({
					key: setting.key,
					value: setting.value,
					createdAt: createdAtByKey.get(setting.key) ?? now,
					updatedAt: now,
				})),
			)
			.run();
	});
}
