import { createServerFn } from "@tanstack/react-start";

import { saveRoomsInputSchema } from "#/shared/architect/architect-schemas";

import {
	RoomValidationError,
	getRooms,
	getRoomsById,
	saveRooms,
} from "./room-service";

export const loadRooms = createServerFn({
	method: "GET",
}).handler(async () => {
	return getRooms();
});

export const loadRoomsById = createServerFn({
	method: "GET",
}).handler(async () => {
	return getRoomsById();
});

export const persistRooms = createServerFn({
	method: "POST",
})
	.validator(saveRoomsInputSchema)
	.handler(async ({ data }) => {
		try {
			const rooms = await saveRooms(data);

			return {
				success: true as const,
				rooms,
			};
		} catch (error) {
			if (error instanceof RoomValidationError) {
				return {
					success: false as const,
					error: {
						code: "ROOM_VALIDATION_ERROR" as const,
						message: error.message,
						roomIds: error.roomIds,
					},
				};
			}

			throw error;
		}
	});
