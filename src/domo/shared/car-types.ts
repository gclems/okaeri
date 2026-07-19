import type { Setting } from "#/server/settings/settings-schemas";

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

export interface DomoCarSnapshot {
	carSetting: Setting | null;
	car: Car | null;
	revision: number;
}
