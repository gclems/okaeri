import type { HassEntities } from "home-assistant-js-websocket";

import type { HomeAssistantEntity } from "#/interfaces/home-assistant";
import type { DomoSetting } from "#/interfaces/settings";
import type { DomoWeather, DomoWeatherCondition } from "#/interfaces/weather";
import type { HomeAssistantRegistryService } from "#/server/home-assistant-registry/home-assistant-registry-service";

export function mapWeather(
	weatherDeviceSetting: DomoSetting,
	registry: HomeAssistantRegistryService,
	entities: HassEntities,
): DomoWeather | null {
	if (!weatherDeviceSetting.value) {
		return null;
	}

	const device = registry.devices.get(weatherDeviceSetting.value);

	if (!device) {
		return null;
	}

	const deviceEntities: HomeAssistantEntity[] = Array.from(
		registry.entities.values(),
	).filter((e) => e.deviceId === device.id);

	const weather: DomoWeather = {
		temperature: 0,
		temperatureUnitOfMeasurement: "",
		humidity: 0,
		humidityUnitOfMeasurement: "",
		pressure: 0,
		pressureUnitOfMeasurement: "",
		windSpeed: 0,
		windGustSpeed: 0,
		windSpeedUnitOfMeasurement: "",
		windBearingAngle: 0,
		visibility: 0,
		visibilityUnitOfMeasurement: "",
		precipitation: 0,
		precipitationUnitOfMeasurement: "",
		uvIndex: 0,
		cloudCover: 0,
		nextRain: null,
		alert: null,
		rainChance: 0,
		snowChance: 0,
		freezeChance: 0,
		condition: "sunny",
	};

	const temperatureEntity = deviceEntities.find((e) =>
		e.entityId.endsWith("_temperature"),
	);
	const humidityEntity = deviceEntities.find((e) =>
		e.entityId.endsWith("_humidity"),
	);
	const pressureEntity = deviceEntities.find((e) =>
		e.entityId.endsWith("_pressure"),
	);
	const windSpeedEntity = deviceEntities.find((e) =>
		e.entityId.endsWith("_wind_speed"),
	);
	const windGustSpeedEntity = deviceEntities.find((e) =>
		e.entityId.endsWith("_wind_gust"),
	);
	const windBearingEntity = deviceEntities.find((e) =>
		e.entityId.endsWith("_wind_bearing"),
	);
	const visibilityEntity = deviceEntities.find((e) =>
		e.entityId.endsWith("_visibility"),
	);
	const precipitationEntity = deviceEntities.find((e) =>
		e.entityId.endsWith("_precipitation"),
	);
	const uvEntity = deviceEntities.find((e) => e.entityId.endsWith("_uv"));
	const cloudCoverEntity = deviceEntities.find((e) =>
		e.entityId.endsWith("_cloudCover"),
	);
	const nextRainEntity = deviceEntities.find((e) =>
		e.entityId.endsWith("_nextRain"),
	);
	const alertEntity = deviceEntities.find((e) => e.entityId.endsWith("_alert"));
	const rainChanceEntity = deviceEntities.find((e) =>
		e.entityId.endsWith("_rainChance"),
	);
	const snowChanceEntity = deviceEntities.find((e) =>
		e.entityId.endsWith("_snowChance"),
	);
	const freezeChanceEntity = deviceEntities.find((e) =>
		e.entityId.endsWith("_freezeChance"),
	);

	for (const entityState of Object.values(entities)) {
		if (entityState.entity_id === temperatureEntity?.entityId) {
			weather.temperature = +entityState.state;
			weather.temperatureUnitOfMeasurement =
				entityState.attributes.unit_of_measurement ?? "";
		}

		if (entityState.entity_id === humidityEntity?.entityId) {
			weather.humidity = +entityState.state;
			weather.humidityUnitOfMeasurement =
				entityState.attributes.unit_of_measurement ?? "";
		}

		if (entityState.entity_id === pressureEntity?.entityId) {
			weather.pressure = +entityState.state;
			weather.pressureUnitOfMeasurement =
				entityState.attributes.unit_of_measurement ?? "";
		}

		if (entityState.entity_id === windSpeedEntity?.entityId) {
			weather.windSpeed = +entityState.state;
			weather.windSpeedUnitOfMeasurement =
				entityState.attributes.unit_of_measurement ?? "";
		}

		if (entityState.entity_id === windGustSpeedEntity?.entityId) {
			weather.windGustSpeed = +entityState.state;
		}

		if (entityState.entity_id === windBearingEntity?.entityId) {
			weather.windBearingAngle = +entityState.state;
		}

		if (entityState.entity_id === visibilityEntity?.entityId) {
			weather.visibility = +entityState.state;
			weather.visibilityUnitOfMeasurement =
				entityState.attributes.unit_of_measurement ?? "";
		}

		if (entityState.entity_id === precipitationEntity?.entityId) {
			weather.precipitation = +entityState.state;
			weather.precipitationUnitOfMeasurement =
				entityState.attributes.unit_of_measurement ?? "";
		}

		if (entityState.entity_id === uvEntity?.entityId) {
			weather.uvIndex = +entityState.state;
		}

		if (entityState.entity_id === cloudCoverEntity?.entityId) {
			weather.cloudCover = +entityState.state;
		}

		if (entityState.entity_id === nextRainEntity?.entityId) {
			weather.nextRain = entityState.state;
		}

		if (entityState.entity_id === alertEntity?.entityId) {
			weather.alert = entityState.state;
		}

		if (entityState.entity_id === rainChanceEntity?.entityId) {
			weather.rainChance = +entityState.state;
		}

		if (entityState.entity_id === snowChanceEntity?.entityId) {
			weather.snowChance = +entityState.state;
		}

		if (entityState.entity_id === freezeChanceEntity?.entityId) {
			weather.freezeChance = +entityState.state;
		}

		if (entityState.entity_id.startsWith("weather")) {
			weather.condition = entityState.state as DomoWeatherCondition; // Assuming you want to store the weather condition as well
		}
	}

	return weather;
}
