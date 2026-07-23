import type { DomoSetting } from "#/interfaces/settings";
import type { DomoServiceSnapshot } from "#/server/domo-service-snapshot";

export type DomoWeather = {
	temperature: number;
	temperatureUnitOfMeasurement: string;

	humidity: number;
	humidityUnitOfMeasurement: string;

	pressure: number;
	pressureUnitOfMeasurement: string;

	windSpeed: number;
	windGustSpeed: number;
	windSpeedUnitOfMeasurement: string;

	windBearingAngle: number;

	visibility: number;
	visibilityUnitOfMeasurement: string;

	precipitation: number;
	precipitationUnitOfMeasurement: string;

	uvIndex: number;

	cloudCover: number;

	nextRain: string | null;

	alert: string | null;

	rainChance: number;
	snowChance: number;
	freezeChance: number;

	condition: DomoWeatherCondition;
};

export type DomoWeatherSnapshot = DomoServiceSnapshot & {
	weatherDeviceSetting: DomoSetting | null;
	weather: DomoWeather | null;
	revision: number;
};

export type DomoWeatherCondition =
	| "clear-night"
	| "cloudy"
	| "exceptional"
	| "fog"
	| "hail"
	| "lightning"
	| "lightning-rainy"
	| "partlycloudy"
	| "pouring"
	| "rainy"
	| "snowy"
	| "snowy-rainy"
	| "sunny"
	| "windy"
	| "windy-variant";
