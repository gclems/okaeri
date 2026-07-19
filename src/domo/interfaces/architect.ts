import type { DomoEntity } from "#/interfaces/domo";

export interface DomoRoom extends DomoEntity {
	haAreaId?: string | null;
	haEnvironmentSensorDeviceId?: string | null;
	color: string;
	layout: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
	walls: {
		top: boolean;
		right: boolean;
		bottom: boolean;
		left: boolean;
	};
}
