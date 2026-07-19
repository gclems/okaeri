import type { DomoEntity } from "#/interfaces/domo";

export interface DomoCar extends DomoEntity {
	settingId: string;

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
