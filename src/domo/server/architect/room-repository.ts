import { inArray } from "drizzle-orm";

import { roomRowToRoom } from "#/shared/architect/architect-room-mapper";
import type { Room } from "#/shared/architect/architect-schemas";

import { db } from "../db/client";
import { roomTable } from "../db/schema";

export async function findAllRooms(): Promise<Room[]> {
	const rows = await db.select().from(roomTable).orderBy(roomTable.createdAt);

	return rows.map(roomRowToRoom);
}

export async function findAllRoomsById(): Promise<Record<string, Room>> {
	const rooms = await findAllRooms();

	return Object.fromEntries(rooms.map((room) => [room.id, room]));
}

export async function replaceAllRooms(rooms: Room[]): Promise<void> {
	const now = new Date();

	db.transaction((transaction) => {
		const roomIds = rooms.map((room) => room.id);

		/*
		 * On récupère les dates de création existantes avant de vider
		 * la table, afin qu'une simple sauvegarde ne recrée pas
		 * artificiellement toutes les pièces.
		 */
		const existingRows =
			roomIds.length > 0
				? transaction
						.select({
							id: roomTable.id,
							createdAt: roomTable.createdAt,
						})
						.from(roomTable)
						.where(inArray(roomTable.id, roomIds))
						.all()
				: [];

		const createdAtById = new Map(
			existingRows.map((row) => [row.id, row.createdAt]),
		);

		transaction.delete(roomTable).run();

		if (rooms.length === 0) {
			return;
		}

		transaction
			.insert(roomTable)
			.values(
				rooms.map((room) => ({
					id: room.id,
					name: room.name,
					haAreaId: room.haAreaId,
					haEnvironmentSensorDeviceId: room.haEnvironmentSensorDeviceId,
					color: room.color,
					x: room.layout.x,
					y: room.layout.y,
					width: room.layout.width,
					height: room.layout.height,
					wall_top: room.walls.top,
					wall_right: room.walls.right,
					wall_bottom: room.walls.bottom,
					wall_left: room.walls.left,
					createdAt: createdAtById.get(room.id) ?? now,
					updatedAt: now,
				})),
			)
			.run();
	});
}
