import { useShallow } from "zustand/react/shallow";

import { useEnvironmentStore } from "@/features/environment/environment.store";

export function useEnvironmentSensors() {
	return useEnvironmentStore(
		useShallow((state) => Object.values(state.snapshot?.sensors ?? {})),
	);
}
