// src/theme/theme.ts
export type OkaeriTheme = "morning" | "day" | "evening" | "night";

export function applyTheme(theme: OkaeriTheme) {
	document.documentElement.dataset.theme = theme;
	localStorage.setItem("okaeri-theme", theme);
}
