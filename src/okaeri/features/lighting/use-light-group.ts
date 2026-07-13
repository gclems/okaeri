import { useShallow } from "zustand/react/shallow";

import { useLightingStore } from "@/features/lighting/lighting.store";

export function useLightGroup(id: string) {
	return useLightingStore(
		useShallow((state) => state.snapshot?.lightGroups?.[id]),
	);
}
