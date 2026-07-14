import { useShallow } from "zustand/react/shallow";

import type { DomoLightGroup } from "#/shared/lighting-types";
import { useLightingStore } from "@/features/lighting/lighting.store";

export function useLightBulbs(group?: DomoLightGroup) {
	return useLightingStore(
		useShallow((state) => {
			const lights = Object.values(state.snapshot?.lights ?? {});
			if (!group) return lights;

			return lights.filter((l) => group.lightIds.includes(l.id));
		}),
	);
}
