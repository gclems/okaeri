import { useWeatherStore } from "@/features/weather/weather.store";

export function useWeather() {
	return useWeatherStore().weather;
}
