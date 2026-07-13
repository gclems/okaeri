export type HassEntityRegistryEntry = {
	entity_id: string;
	unique_id: string;
	platform: string;

	device_id: string | null;
	area_id: string | null;

	name: string | null;
	original_name: string | null;

	disabled_by: string | null;
	hidden_by: string | null;
};

export type HassDeviceRegistryEntry = {
	id: string;

	area_id: string | null;

	name: string | null;
	name_by_user: string | null;

	manufacturer: string | null;
	model: string | null;
};

export type HassAreaRegistryEntry = {
	area_id: string;
	name: string;

	floor_id?: string | null;
};

export type DomoRegistryEntity = {
	id: string;
	name: string;
	domain: string;

	device_id: string | null;
	area_id: string | null;
};
