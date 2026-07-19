export interface MetNoSun {
	properties: {
		body: "Sun";
		sunrise: {
			time: string;
			azimuth: number;
		};
		sunset: {
			time: string;
			azimuth: number;
		};
		solarnoon: {
			time: string;
			disc_centre_elevation: number;
			visible: boolean;
		};
		solarmidnight: {
			time: string;
			disc_centre_elevation: number;
			visible: boolean;
		};
	};
}
