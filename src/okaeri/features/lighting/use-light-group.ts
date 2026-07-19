import { useLightingStore } from "@/features/lighting/lighting.store";

export function useLightGroup(id: string) {
	return useLightingStore().lightGroups[id] ?? null;
}
