import { useShallow } from "zustand/react/shallow";

import { useLightingStore } from "@/features/lighting/lighting.store";

export function useLightBulb(id: string) {
	return useLightingStore(useShallow((state) => state.snapshot?.lights?.[id]));
}
