import type { DomoRegistryEntity } from "#/shared/hass-registry-types";

export interface DomoThermometer extends DomoRegistryEntity {
	domain: "sensor.thermometre";
}
