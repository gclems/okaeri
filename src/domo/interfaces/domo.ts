export type DomoEntity = {
	id: string;
	name: string;

	areaId: string | null;
	deviceId: string | null;

	lastStateUpdated: Date | null;
	lastUpdated: Date | null;
};
