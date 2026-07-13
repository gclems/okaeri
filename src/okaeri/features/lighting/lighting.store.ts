import { create } from "zustand";

import type { DomoLightingSnapshot } from "#/shared/lighting-types";

type ConnectionState = "idle" | "connecting" | "connected" | "error";

interface LightingState {
	snapshot: DomoLightingSnapshot | null;
	connectionState: ConnectionState;

	setSnapshot: (snapshot: DomoLightingSnapshot) => void;
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
