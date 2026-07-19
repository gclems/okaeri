import type { DomoEntity } from "#/interfaces/domo";

export type DomoEnvironmentSensorMeasurement = {
	value: number;
	unit: string;
};

export interface DomoEnvironmentSensor extends DomoEntity {
	thermometer: DomoEnvironmentSensorMeasurement | null;
	hygrometer: DomoEnvironmentSensorMeasurement | null;
	barometer: DomoEnvironmentSensorMeasurement | null;

	apparentTemperature: DomoEnvironmentSensorMeasurement | null;
}
