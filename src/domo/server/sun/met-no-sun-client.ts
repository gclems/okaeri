import { getDomoServerConfig } from "#/server/config";

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

export async function fetchSun(date: Date): Promise<MetNoSun> {
	const domoConfig = getDomoServerConfig();
	const url = new URL("https://api.met.no/weatherapi/sunrise/3.0/sun");

	url.searchParams.set("lat", domoConfig.latitude.toString());
	url.searchParams.set("lon", domoConfig.longitude.toString());
	url.searchParams.set("date", getLocalDate(date, domoConfig.timezone));

	const response = await fetch(url, {
		headers: {
			"User-Agent": domoConfig.metNoUserAgent,
		},
	});

	if (!response.ok) {
		throw new Error(
			`met.no Sunrise returned ${response.status} ${response.statusText}`,
		);
	}

	const result = await response.json();
	return result;
}

function getLocalDate(date: Date, timezone: string): string {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: timezone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(date);
}
