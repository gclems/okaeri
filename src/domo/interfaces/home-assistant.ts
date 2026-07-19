export type HomeAssistantArea = {
	id: string;
	name: string;
	aliases: string[];

	createdAt: Date;
	modifiedAt: Date;

	raw: HomeAssistantWebSocketArea;
};

export type HomeAssistantDevice = {
	id: string;

	name: string;
	originalName: string | null;

	manufacturer: string | null;
	model: string | null;

	areaId: string | null;

	createdAt: Date;
	modifiedAt: Date;

	raw: HomeAssistantWebSocketDevice;
};

export type HomeAssistantEntity = {
	id: string;
	entityId: string;

	name: string;
	originalName: string | null;

	platform: string | null;

	deviceId: string | null;
	areaId: string | null;

	createdAt: Date;
	modifiedAt: Date;

	raw: HomeAssistantWebSocketEntity;
};

export type HomeAssistantWebSocketEntity = {
	area_id: string | null;
	config_entry_id: string;
	config_subentry_id: string | null;
	created_at: number;
	device_id: string;
	disabled_by: string | null;
	entity_category: string | null;
	entity_id: string;
	has_entity_name: boolean;
	hidden_by: string | null;
	icon: string | null;
	id: string;
	labels: string[];
	modified_at: number | null;
	name: string | null;
	original_name: string;
	platform: string;
	translation_key: string;
	unique_id: string;
};

export type HomeAssistantWebSocketDevice = {
	area_id: string | null;
	configuration_url: string | null;
	config_entries: string[];
	created_at: number;
	disabled_by: string | null;
	entry_type: string | null;
	hw_version: string | null;
	id: string;
	identifiers: [string, string][];
	labels: string[];
	manufacturer: string | null;
	model: string | null;
	model_id: string | null;
	modified_at: number | null;
	name_by_user: string | null;
	name: string | null;
	primary_config_entry: string;
	serial_number: string | null;
	sw_version: string | null;
	via_device_id: string | null;
};

export type HomeAssistantWebSocketArea = {
	area_id: string;
	aliases: string[];
	created_at: number;
	modified_at: number | null;
	name: string;
};
