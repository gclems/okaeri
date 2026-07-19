import type { MetNoSun } from "#/interfaces/metno";
import type { DomoSun } from "#/interfaces/sun";

function mapDaylySun(date: Date, metNo: MetNoSun): DomoSun {
	return {
		date,

		sunriseAt: new Date(metNo.properties.sunrise.time),
		sunriseAzimuth: metNo.properties.sunrise.azimuth,

		sunsetAt: new Date(metNo.properties.sunset.time),
		sunsetAzimuth: metNo.properties.sunset.azimuth,

		solarnoonAt: new Date(metNo.properties.solarnoon.time),
		solarnoonDiscCentreElevation:
			metNo.properties.solarnoon.disc_centre_elevation,
		solarnoonVisible: metNo.properties.solarnoon.visible,
	};
}

export function mapSun(date: Date, metNo: MetNoSun): DomoSun {
	return mapDaylySun(date, metNo);
}
