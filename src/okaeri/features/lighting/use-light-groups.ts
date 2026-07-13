import { useShallow } from "zustand/react/shallow";

import type { DomoLightGroup } from "#/shared/lighting-types";
import { useLightingStore } from "@/features/lighting/lighting.store";

export function useLightGroups() {
	return useLightingStore(
		useShallow((state) =>
			Object.values(
				(state.snapshot?.lightGroups ?? {}) as Record<string, DomoLightGroup>,
			),
		),
	);
}
