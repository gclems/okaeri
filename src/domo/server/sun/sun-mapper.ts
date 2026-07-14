import type { MetNoSun } from "#/server/sun/met-no-sun-client";
import type { DaylySun, Sun } from "#/shared/sun-types";

function mapDaylySun(date: Date, metNo: MetNoSun): DaylySun {
	return {
		date,

		sunrise_at: new Date(metNo.properties.sunrise.time),
		sunrise_azimuth: metNo.properties.sunrise.azimuth,

		sunset_at: new Date(metNo.properties.sunset.time),
		sunset_azimuth: metNo.properties.sunset.azimuth,

		solarnoon_at: new Date(metNo.properties.solarnoon.time),
		solarnoon_disc_centre_elevation:
			metNo.properties.solarnoon.disc_centre_elevation,
		solarnoon_visible: metNo.properties.solarnoon.visible,
	};
}

export function mapSun(date: Date, metNo: MetNoSun, tomorrow: MetNoSun): Sun {
	const todaySun = mapDaylySun(date, metNo);
	const tomorrowSun = mapDaylySun(
		new Date(date.getTime() + 24 * 60 * 60 * 1000),
		tomorrow,
	);

	return {
		...todaySun,
		tomorrow: tomorrowSun,
	};
}
