import { create } from "zustand";

import type { DomoCarSnapshot } from "#/shared/car-types";

type ConnectionState = "idle" | "connecting" | "connected" | "error";

interface CarState {
	snapshot: DomoCarSnapshot | null;
	connectionState: ConnectionState;

	setSnapshot: (snapshot: DomoCarSnapshot) => void;
	setConnectionState: (state: ConnectionState) => void;
}

export const useCarStore = create<CarState>((set) => ({
	snapshot: null,
	connectionState: "idle",

	setSnapshot: (snapshot) => {
		set({ snapshot });
	},

	setConnectionState: (connectionState) => {
		set({ connectionState });
	},
}));
