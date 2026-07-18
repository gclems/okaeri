import z from "zod";

export const settingSchema = z.object({
	key: z.string().trim().min(1).max(100),
	value: z.string().nullable(),
});

export const findSettingByKeyInputSchema = z.object({
	key: z.string().trim().min(1).max(100),
});

export const saveSettingsInputSchema = z.array(settingSchema).max(100);

export type Setting = z.infer<typeof settingSchema>;
export type SaveSettingsInput = z.infer<typeof saveSettingsInputSchema>;
