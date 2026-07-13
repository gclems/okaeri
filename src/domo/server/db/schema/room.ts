import { sql } from "drizzle-orm";
import { check, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const roomTable = sqliteTable(
	"room",
	{
		id: text("id").primaryKey(),

		name: text("name").notNull(),

		haRoomId: text("ha_area_id"),

		color: text("color").notNull(),

		x: integer("x").notNull(),
		y: integer("y").notNull(),
		width: integer("width").notNull(),
		height: integer("height").notNull(),

		wall_top: integer("wall_top", { mode: "boolean" }).notNull().default(true),
		wall_right: integer("wall_right", { mode: "boolean" })
			.notNull()
			.default(true),
		wall_bottom: integer("wall_bottom", { mode: "boolean" })
			.notNull()
			.default(true),
		wall_left: integer("wall_left", { mode: "boolean" }).notNull().default(true),

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
	},
	(table) => [
		check("room_x_positive", sql`${table.x} >= 0`),
		check("room_y_positive", sql`${table.y} >= 0`),
		check("room_width_positive", sql`${table.width} > 0`),
		check("room_height_positive", sql`${table.height} > 0`),
	],
);

export type RoomRow = typeof roomTable.$inferSelect;
export type NewRoomRow = typeof roomTable.$inferInsert;
