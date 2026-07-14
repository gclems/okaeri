export interface DaylySun {
	date: Date;

	sunrise_at: Date;
	sunrise_azimuth: number;

	sunset_at: Date;
	sunset_azimuth: number;

	solarnoon_at: Date;
	solarnoon_disc_centre_elevation: number;
	solarnoon_visible: boolean;
}

export interface Sun extends DaylySun {
	tomorrow: DaylySun;
}
