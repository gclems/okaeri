import type { Room } from "#/domo/shared/architect/architect-schemas";

import {
	findAllRooms,
	findAllRoomsById,
	replaceAllRooms,
} from "./room-repository";

export class RoomValidationError extends Error {
	constructor(
		message: string,
		public readonly roomIds: string[] = [],
	) {
		super(message);
		this.name = "RoomValidationError";
	}
}

export async function getRooms(): Promise<Room[]> {
	return findAllRooms();
}

export async function getRoomsById(): Promise<Record<string, Room>> {
	return findAllRoomsById();
}

export async function saveRooms(rooms: Room[]): Promise<Record<string, Room>> {
	await replaceAllRooms(rooms);

	return Object.fromEntries(rooms.map((room) => [room.id, room]));
}
