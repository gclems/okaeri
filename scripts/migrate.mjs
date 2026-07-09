import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const databasePath = resolve(
	process.env.DOMO_DATABASE_PATH ?? "./data/domo.sqlite",
);

const migrationsFolder = resolve(
	process.env.DOMO_MIGRATIONS_PATH ??
		"./src/domo/server/db/migrations",
);

mkdirSync(dirname(databasePath), { recursive: true });

const sqlite = new Database(databasePath);

try {
	sqlite.pragma("foreign_keys = ON");
	sqlite.pragma("journal_mode = WAL");
	sqlite.pragma("busy_timeout = 5000");

	console.info(`Migrating database: ${databasePath}`);

	migrate(drizzle(sqlite), {
		migrationsFolder,
	});

	console.info("Database migrations completed.");
} catch (error) {
	console.error("Database migration failed.", error);
	process.exitCode = 1;
} finally {
	sqlite.close();
}