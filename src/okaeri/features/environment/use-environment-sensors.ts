import { useEnvironmentStore } from "@/features/environment/environment.store";

export function useEnvironmentSensors() {
	return useEnvironmentStore().sensors;
}
