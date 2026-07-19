import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
	HomeAssistantArea,
	HomeAssistantDevice,
} from "#/interfaces/home-assistant";
import { persistRooms } from "#/server/architect/room-functions";
import type { Room } from "#/shared/architect-types";
import { roomsQueryOptions } from "@/features/architect/use-rooms";

interface HomeArchitectContext {
	selectedRoom: Room | null;
	rooms: Record<string, Room>;

	haAreas: HomeAssistantArea[];
	haDevices: HomeAssistantDevice[];

	changed: boolean;

	addRoom: (room: Room) => void;
	updateRoom: (roomId: string, updatedRoom: Partial<Room>) => void;
	deleteRoom: (roomId: string) => void;

	selectRoom: (roomId: string | null) => void;

	reset: () => void;
	save: () => void;
}

const ArchitectContext = createContext<HomeArchitectContext | null>(null);

export function HomeArchitectProvider({
	defaultRooms = [],
	haAreas = [],
	haDevices = [],
	children,
}: {
	defaultRooms: Room[];
	haAreas: HomeAssistantArea[];
	haDevices: HomeAssistantDevice[];
	children: React.ReactNode;
}) {
	const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
	const [rooms, setRooms] = useState<Record<string, Room>>(() => {
		const initialRooms: Record<string, Room> = {};
		defaultRooms.forEach((room) => {
			initialRooms[room.id] = room;
		});
		return initialRooms;
	});

	const [changed, setChanged] = useState(false);

	const selectedRoom = useMemo(
		() => (selectedRoomId ? rooms[selectedRoomId] : null),
		[selectedRoomId, rooms],
	);

	const addRoom = useCallback((room: Room) => {
		setRooms((prevRooms) => ({
			...prevRooms,
			[room.id]: room,
		}));

		setChanged(true);
	}, []);

	const selectRoom = useCallback((roomId: string | null) => {
		setSelectedRoomId(roomId);
	}, []);

	const updateRoom = useCallback(
		(roomId: string, updatedRoom: Partial<Room>) => {
			setRooms((prevRooms) => ({
				...prevRooms,
				[roomId]: {
					...prevRooms[roomId],
					...updatedRoom,
				},
			}));

			setChanged(true);
		},
		[],
	);

	const deleteRoom = useCallback(
		(roomId: string) => {
			setRooms((prevRooms) => {
				const { [roomId]: _, ...remainingRooms } = prevRooms;
				return remainingRooms;
			});

			setChanged(true);

			if (selectedRoomId === roomId) {
				setSelectedRoomId(null);
			}
		},
		[selectedRoomId],
	);

	const reset = useCallback(() => {
		setRooms(() => {
			const initialRooms: Record<string, Room> = {};
			defaultRooms.forEach((room) => {
				initialRooms[room.id] = room;
			});
			return initialRooms;
		});
		setSelectedRoomId(null);
		setChanged(false);
	}, [defaultRooms]);

	const queryClient = useQueryClient();
	const saveMutation = useMutation({
		mutationFn: (rooms: Room[]) =>
			persistRooms({
				data: rooms,
			}),

		onSuccess: () => {
			queryClient.setQueryData(roomsQueryOptions.queryKey, Object.values(rooms));
		},
	});

	const save = useCallback(async () => {
		const data = Object.values(rooms);
		// convert empty strings to null for all rooms properties
		data.forEach((room) => {
			if (room.haAreaId === "") {
				room.haAreaId = null;
			}
			if (room.haEnvironmentSensorDeviceId === "") {
				room.haEnvironmentSensorDeviceId = null;
			}
		});

		await saveMutation.mutateAsync(data);
		setChanged(false);
	}, [rooms, saveMutation]);

	return (
		<ArchitectContext
			value={{
				selectedRoom,
				rooms,
				haAreas,
				haDevices,
				changed,
				addRoom,
				updateRoom,
				deleteRoom,
				selectRoom,
				reset,
				save,
			}}
		>
			{children}
		</ArchitectContext>
	);
}

export function useHomeArchitect(): HomeArchitectContext {
	const context = useContext(ArchitectContext);
	if (!context) {
		throw new Error(
			"useHomeArchitect must be used within a HomeArchitectProvider",
		);
	}
	return context;
}
