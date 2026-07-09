import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "sqlite",

	schema: "./src/domo/server/db/schema/index.ts",

	out: "./src/domo/server/db/migrations",

	dbCredentials: {
		url: process.env.DOMO_DATABASE_PATH ?? "./data/domo.sqlite",
	},

	verbose: true,
	strict: true,
});