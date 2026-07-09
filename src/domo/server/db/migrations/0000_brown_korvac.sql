CREATE TABLE `room` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`ha_area_id` text,
	`x` integer NOT NULL,
	`y` integer NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`wall_top` boolean DEFAULT true NOT NULL,
	`wall_right` boolean DEFAULT true NOT NULL,
	`wall_bottom` boolean DEFAULT true NOT NULL,
	`wall_left` boolean DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT "room_x_positive" CHECK("room"."x" >= 0),
	CONSTRAINT "room_y_positive" CHECK("room"."y" >= 0),
	CONSTRAINT "room_width_positive" CHECK("room"."width" > 0),
	CONSTRAINT "room_height_positive" CHECK("room"."height" > 0)
);
