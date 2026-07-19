export interface DomoSun {
	date: Date;

	sunriseAt: Date;
	sunriseAzimuth: number;

	sunsetAt: Date;
	sunsetAzimuth: number;

	solarnoonAt: Date;
	solarnoonDiscCentreElevation: number;
	solarnoonVisible: boolean;
}
