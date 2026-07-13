import { z } from "zod";

export const roomLayoutSchema = z.object({
	x: z.number().int().min(0),
	y: z.number().int().min(0),
	width: z.number().int().positive(),
	height: z.number().int().positive(),
});

export const roomWallsSchema = z.object({
	top: z.boolean(),
	right: z.boolean(),
	bottom: z.boolean(),
	left: z.boolean(),
});

export const roomSchema = z.object({
	id: z.string().uuid(),
	name: z.string().trim().min(1).max(100),
	haRoomId: z.string().trim().min(1).nullable(),
	color: z.string(),
	layout: roomLayoutSchema,
	walls: roomWallsSchema,
});

export const saveRoomsInputSchema = z.array(roomSchema).max(50);

export type Room = z.infer<typeof roomSchema>;
export type RoomLayout = z.infer<typeof roomLayoutSchema>;
export type RoomWalls = z.infer<typeof roomWallsSchema>;
export type SaveRoomsInput = z.infer<typeof saveRoomsInputSchema>;
