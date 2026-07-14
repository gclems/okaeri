import { create } from "zustand";

import type { Sun } from "#/shared/sun-types";

type ConnectionState = "idle" | "connecting" | "connected" | "error";

interface SunState {
	snapshot: Sun | null;
	connectionState: ConnectionState;

	setSnapshot: (snapshot: Sun) => void;
	setConnectionState: (state: ConnectionState) => void;
}

export const useSunStore = create<SunState>((set) => ({
	snapshot: null,
	connectionState: "idle",

	setSnapshot: (snapshot) => {
		set({ snapshot });
	},

	setConnectionState: (connectionState) => {
		set({ connectionState });
	},
}));
