import { create } from "zustand";

import type { LightingSnapshot } from "#/shared/lighting";

type ConnectionState = "idle" | "connecting" | "connected" | "error";

interface LightingState {
	snapshot: LightingSnapshot | null;
	connectionState: ConnectionState;

	setSnapshot: (snapshot: LightingSnapshot) => void;
	setConnectionState: (state: ConnectionState) => void;
}

export const useLightingStore = create<LightingState>((set) => ({
	snapshot: null,
	connectionState: "idle",

	setSnapshot: (snapshot) => {
		set({ snapshot });
	},

	setConnectionState: (connectionState) => {
		set({ connectionState });
	},
}));
