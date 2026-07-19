import { useLightingStore } from "@/features/lighting/lighting.store";

export function useLightGroups() {
	const { lightGroups } = useLightingStore();

	return Object.values(lightGroups);
}
