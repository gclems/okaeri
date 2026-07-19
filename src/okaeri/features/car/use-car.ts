import { useCarStore } from "@/features/car/car.store";

export function useCar() {
	return useCarStore().car;
}
