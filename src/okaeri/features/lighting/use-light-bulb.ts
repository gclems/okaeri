import { useLightingStore } from "@/features/lighting/lighting.store";

export function useLightBulb(id: string) {
	return useLightingStore().lights[id] ?? null;
}
