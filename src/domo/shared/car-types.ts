import type { DomoSetting } from "#/interfaces/settings";
import type { DomoServiceSnapshot } from "#/server/domo-service-snapshot";

export interface Car {
	name: string;

	device_id: string;

	batteryLevel: number;
	batteryLife: number;
	batteryTemperature: number;

	wired: boolean;
	charging: boolean;
	chargingPower: number;
	chargingUnitOfMeasure: "KWh";
	remainingChargeTime: number;
	chargingMode: string;

	maximumChargePower: number;

	place: string;

	minimumChargeLevel: number;
	targetChargeLevel: number;

	totalMileage: number;

	exteriorTemperature: number;
}

export type DomoCarSnapshot = DomoServiceSnapshot & {
	carSetting: DomoSetting | null;
	car: Car | null;
	revision: number;
};
