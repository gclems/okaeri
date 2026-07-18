import type { Room } from "#/server/architect/architect-schemas";

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

export async function saveRooms(rooms: Room[]): Promise<void> {
	await replaceAllRooms(rooms);
}
