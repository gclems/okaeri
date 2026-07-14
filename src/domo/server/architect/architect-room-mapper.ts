import type { NewRoomRow, RoomRow } from "#/server/db/schema";

import type { Room } from "../../shared/architect-types";

export function roomRowToRoom(row: RoomRow): Room {
	return {
		id: row.id as string,
		name: row.name as string,
		haAreaId: row.haAreaId as string | null,
		haEnvironmentSensorDeviceId: row.haEnvironmentSensorDeviceId as string | null,
		color: row.color as string,
		layout: {
			x: row.x as number,
			y: row.y as number,
			width: row.width as number,
			height: row.height as number,
		},
		walls: {
			top: row.wall_top as boolean,
			right: row.wall_right as boolean,
			bottom: row.wall_bottom as boolean,
			left: row.wall_left as boolean,
		},
	};
}

export function roomToNewRoomRow(room: Room, now = new Date()): NewRoomRow {
	return {
		id: room.id,
		name: room.name,
		haAreaId: room.haAreaId,
		haEnvironmentSensorDeviceId: room.haEnvironmentSensorDeviceId,
		color: room.color,
		x: room.layout.x,
		y: room.layout.y,
		width: room.layout.width,
		height: room.layout.height,
		createdAt: now,
		updatedAt: now,
		wall_top: room.walls.top,
		wall_right: room.walls.right,
		wall_bottom: room.walls.bottom,
		wall_left: room.walls.left,
	};
}
