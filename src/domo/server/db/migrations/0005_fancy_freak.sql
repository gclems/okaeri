PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_setting` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_setting`("key", "value", "created_at", "updated_at") SELECT "key", "value", "created_at", "updated_at" FROM `setting`;--> statement-breakpoint
DROP TABLE `setting`;--> statement-breakpoint
ALTER TABLE `__new_setting` RENAME TO `setting`;--> statement-breakpoint
PRAGMA foreign_keys=ON;