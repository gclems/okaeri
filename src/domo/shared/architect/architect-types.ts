export interface Room {
	id: string;
	name: string;
	haRoomId: string | null;
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
