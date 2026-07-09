import { resolve } from "node:path";

import { migrate } from "drizzle-orm/better-sqlite3/migrator";

import { databasePath, db } from "./client";

const migrationsFolder = resolve(
	process.cwd(),
	"src/domo/server/db/migrations",
);

try {
	console.info(`Migrating Domo database: ${databasePath}`);

	migrate(db, {
		migrationsFolder,
	});

	console.info("Domo database migrations completed.");
} catch (error) {
	console.error("Domo database migration failed.", error);
	process.exitCode = 1;
}
