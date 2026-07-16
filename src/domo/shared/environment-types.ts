import type { DomoRegistryEntity } from "#/shared/hass-registry-types";

interface DomoSensorEntity extends DomoRegistryEntity {
	unitOfMeasurement: string;
	value: number;

	lastChanged: string | null;
	lastUpdated: string | null;
}
export interface DomoThermometer extends DomoSensorEntity {
	deviceClass: "temperature";
	unitOfMeasurement: "°C" | "°F";
}

export interface DomoHygrometer extends DomoSensorEntity {
	deviceClass: "humidity";
	unitOfMeasurement: "%";
}

export interface DomoBarometer extends DomoSensorEntity {
	deviceClass: "pressure";
	unitOfMeasurement: "hPa" | "inHg" | "mmHg";
}

export interface ApparentTemperature {
	value: number;
	unit: "°C" | "°F";
}

export interface DomoEnvironmentSensor {
	id: string;
	areaId: string;
	deviceId: string;

	thermometer: DomoThermometer | null;
	hygrometer: DomoHygrometer | null;
	barometer: DomoBarometer | null;

	apparentTemperature: ApparentTemperature | null;
}

export interface DomoEnvironmentSnapshot {
	sensors: Readonly<Record<string, DomoEnvironmentSensor>>;
	revision: number;
}
