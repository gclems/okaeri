type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue };

export type HaEntity = {
	entity_id: string;
	state: string;
	attributes: Record<string, JsonValue>;
	last_changed: string;
	last_updated: string;
};

export type LightEntity = HaEntity & {
	entity_id: `light.${string}`;
	attributes: {
		friendly_name?: string;
		brightness?: number;
		rgb_color?: [number, number, number];
		color_temp_kelvin?: number;
		supported_color_modes?: string[];
		[key: string]: JsonValue | undefined;
	};
};

export type LightGroupEntity = LightEntity & {
	attributes: {
		lights: string[];
	};
};

export type SunEntity = HaEntity & {
	entity_id: "sun.sun";
	attributes: {};
};

// export type WeatherForecastItem = {
// 	datetime: string;
// 	condition: string;
// 	temperature?: number;
// 	templow?: number;
// 	precipitation_probability?: number;
// 	wind_speed?: number;
// };

// export type WeatherState = {
// 	entityId: string | null;
// 	current: {
// 		condition: string;
// 		temperature?: number;
// 		humidity?: number;
// 		wind_speed?: number;
// 	} | null;
// 	dailyForecast: WeatherForecastItem[];
// 	hourlyForecast: WeatherForecastItem[];
// 	isLoading: boolean;
// 	error: string | null;
// 	lastUpdatedAt: Date | null;

// 	setCurrentFromEntity: (entity: unknown) => void;
// 	fetchForecasts: (connection: unknown, entityId: string) => Promise<void>;
// };

// export const WEATHER_CONDITIONS = {
// 	ClearNight: "clear-night",
// 	Cloudy: "cloudy",
// 	Exceptional: "exceptional",
// 	Fog: "fog",
// 	Hail: "hail",
// 	Lightning: "lightning",
// 	LightningRainy: "lightning-rainy",
// 	PartlyCloudy: "partlycloudy",
// 	Pouring: "pouring",
// 	Rainy: "rainy",
// 	Snowy: "snowy",
// 	SnowyRainy: "snowy-rainy",
// 	Sunny: "sunny",
// 	Windy: "windy",
// 	WindyVariant: "windy-variant",
// } as const;

// export type WeatherCondition =
// 	(typeof WEATHER_CONDITIONS)[keyof typeof WEATHER_CONDITIONS];
