PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_room` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`ha_area_id` text,
	`color` text NOT NULL,
	`x` integer NOT NULL,
	`y` integer NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`wall_top` integer DEFAULT true NOT NULL,
	`wall_right` integer DEFAULT true NOT NULL,
	`wall_bottom` integer DEFAULT true NOT NULL,
	`wall_left` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT "room_x_positive" CHECK("__new_room"."x" >= 0),
	CONSTRAINT "room_y_positive" CHECK("__new_room"."y" >= 0),
	CONSTRAINT "room_width_positive" CHECK("__new_room"."width" > 0),
	CONSTRAINT "room_height_positive" CHECK("__new_room"."height" > 0)
);
--> statement-breakpoint
INSERT INTO `__new_room`("id", "name", "ha_area_id", "color", "x", "y", "width", "height", "wall_top", "wall_right", "wall_bottom", "wall_left", "created_at", "updated_at") SELECT "id", "name", "ha_area_id", "color", "x", "y", "width", "height", "wall_top", "wall_right", "wall_bottom", "wall_left", "created_at", "updated_at" FROM `room`;--> statement-breakpoint
DROP TABLE `room`;--> statement-breakpoint
ALTER TABLE `__new_room` RENAME TO `room`;--> statement-breakpoint
PRAGMA foreign_keys=ON;