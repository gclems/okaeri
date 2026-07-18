CREATE TABLE `setting` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`value` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
