export interface AreaRegistryEntry {
	area_id: string;
	name: string;

	icon: string | null;
	floor_id: string | null;

	aliases: string[] | null;
	labels: string[] | null;

	picture: string | null;
	temperature_entity_id: string | null;
	humidity_entity_id: string | null;
}

export interface HomeAssistantArea {
	id: string;
	name: string;
	floorId?: string;
	aliases?: string[];
}
