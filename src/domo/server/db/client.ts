import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import * as schema from "./schema";

const databasePath = resolve(
	process.env.DOMO_DATABASE_PATH ?? "./data/domo.sqlite",
);

mkdirSync(dirname(databasePath), {
	recursive: true,
});

function createDatabase() {
	const sqlite = new Database(databasePath);

	sqlite.pragma("foreign_keys = ON");
	sqlite.pragma("journal_mode = WAL");
	sqlite.pragma("busy_timeout = 5000");

	return {
		sqlite,
		db: drizzle(sqlite, {
			schema,
		}),
	};
}

type DatabaseInstance = ReturnType<typeof createDatabase>;

declare global {
	var __domoDatabase: DatabaseInstance | undefined;
}

/*
 * En développement, Vite peut réévaluer ce module lors du HMR.
 * On réutilise donc la connexion existante plutôt que d'ouvrir
 * plusieurs connexions SQLite successives.
 */
const databaseInstance = globalThis.__domoDatabase ?? createDatabase();

if (process.env.NODE_ENV !== "production") {
	globalThis.__domoDatabase = databaseInstance;
}

export const db = databaseInstance.db;
export const sqlite = databaseInstance.sqlite;
export { databasePath };
