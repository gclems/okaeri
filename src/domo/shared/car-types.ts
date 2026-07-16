export interface Car {
	name: string;

	device_id: string;

	batteryLevel: number;

	charging: boolean;
	chargingPower: number;
	chargingUnitOfMeasure: "KWh";
}
