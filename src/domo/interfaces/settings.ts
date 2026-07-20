import type { z } from "zod";

import type { settingSchema } from "#/server/settings/settings-validation";

export type DomoSetting = z.infer<typeof settingSchema>;
