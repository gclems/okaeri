import { useShallow } from "zustand/react/shallow";

import { useCarStore } from "@/features/car/car.store";

export function useCar() {
	return useCarStore(useShallow((state) => state.snapshot?.car));
}
