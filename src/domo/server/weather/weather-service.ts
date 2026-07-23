import type { HassEntities } from "home-assistant-js-websocket";

import type { DomoWeatherSnapshot } from "#/interfaces/weather";
import type { HomeAssistantClient } from "#/server/home-assistant-client";
import type { HomeAssistantRegistryService } from "#/server/home-assistant-registry/home-assistant-registry-service";
import { HomeAssistantService } from "#/server/home-assistant-service";
import { findSettingByKey } from "#/server/settings/settings-service";
import { mapWeather } from "#/server/weather/weather-mapper";

export class WeatherService extends HomeAssistantService<DomoWeatherSnapshot> {
	public constructor(
		homeAssistant: HomeAssistantClient,
		registry: HomeAssistantRegistryService,
	) {
		super("weather", homeAssistant, registry);
	}

	public weatherSettingChanged(): void {
		this.snapshot.weatherDeviceSetting = null;
	}

	public async synchronize(entities: HassEntities): Promise<boolean> {
		const deviceSetting =
			this.snapshot?.weatherDeviceSetting ??
			(await findSettingByKey("weather_device_id"));

		if (!deviceSetting || !deviceSetting.value) {
			const changed = this.snapshot.weatherDeviceSetting !== deviceSetting;

			if (changed) {
				this.snapshot = {
					weatherDeviceSetting: null,
					weather: null,
					revision: this.snapshot.revision + 1,
				};
			}
			return changed;
		}

		const weather = mapWeather(deviceSetting, this.registry, entities);

		const newSnapshot: DomoWeatherSnapshot = {
			weatherDeviceSetting: deviceSetting,
			weather,
			revision: this.snapshot.revision + 1,
		};

		if (this.areSnapshotsEqual(this.snapshot, newSnapshot)) {
			return false;
		}

		this.snapshot = newSnapshot;
		return true;
	}

	private areSnapshotsEqual(
		a: DomoWeatherSnapshot,
		b: DomoWeatherSnapshot,
	): boolean {
		const sameSettings = a.weatherDeviceSetting === b.weatherDeviceSetting;
		const sameWeatherObject = a.weather === b.weather;

		return (
			sameSettings &&
			sameWeatherObject &&
			a.weather?.alert === b.weather?.alert &&
			a.weather?.cloudCover === b.weather?.cloudCover &&
			a.weather?.freezeChance === b.weather?.freezeChance &&
			a.weather?.humidity === b.weather?.humidity &&
			a.weather?.nextRain === b.weather?.nextRain &&
			a.weather?.precipitation === b.weather?.precipitation &&
			a.weather?.pressure === b.weather?.pressure &&
			a.weather?.rainChance === b.weather?.rainChance &&
			a.weather?.snowChance === b.weather?.snowChance &&
			a.weather?.temperature === b.weather?.temperature &&
			a.weather?.uvIndex === b.weather?.uvIndex &&
			a.weather?.visibility === b.weather?.visibility &&
			a.weather?.windBearingAngle === b.weather?.windBearingAngle &&
			a.weather?.windGustSpeed === b.weather?.windGustSpeed &&
			a.weather?.windSpeed === b.weather?.windSpeed
		);
	}
}
