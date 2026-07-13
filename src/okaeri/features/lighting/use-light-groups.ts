import { useShallow } from "zustand/react/shallow";

import { useLightingStore } from "@/features/lighting/lighting.store";

export function useLightGroups() {
	return useLightingStore(
		useShallow((state) => Object.values(state.snapshot?.lightGroups ?? {})),
	);
}
