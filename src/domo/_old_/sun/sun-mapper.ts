import type { HaEntity, SunEntity } from "../ha-adapter/ha-types";

export function isSunEntity(entity: HaEntity): entity is SunEntity {
	return entity.entity_id === "sun.sun";
}

export function mapHaSunToDomoSun(entity: SunEntity) {
	return {};
}
