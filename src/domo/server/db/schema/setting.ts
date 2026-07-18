import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const settingTable = sqliteTable("setting", {
	key: text("key").primaryKey(),
	value: text("value"),

	createdAt: integer("created_at", {
		mode: "timestamp_ms",
	})
		.notNull()
		.$defaultFn(() => new Date()),

	updatedAt: integer("updated_at", {
		mode: "timestamp_ms",
	})
		.notNull()
		.$defaultFn(() => new Date()),
});

export type SettingRow = typeof settingTable.$inferSelect;
export type NewSettingRow = typeof settingTable.$inferInsert;
