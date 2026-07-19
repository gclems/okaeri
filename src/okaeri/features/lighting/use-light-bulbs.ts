import type { DomoLightBulb, DomoLightGroup } from "#/interfaces/lighting";
import { useLightingStore } from "@/features/lighting/lighting.store";

export function useLightBulbs(group?: DomoLightGroup): DomoLightBulb[] {
	const { lights } = useLightingStore();

	if (!group) return Object.values(lights);
	return Object.values(lights).filter((l) => group.lightNames.includes(l.name));
}
