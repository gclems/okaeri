import { create } from "zustand";

import type { DomoEnvironmentSnapshot } from "#/shared/environment-types";

type ConnectionState = "idle" | "connecting" | "connected" | "error";

interface EnvironmentState {
	snapshot: DomoEnvironmentSnapshot | null;
	connectionState: ConnectionState;

	setSnapshot: (snapshot: DomoEnvironmentSnapshot) => void;
	setConnectionState: (state: ConnectionState) => void;
}

export const useEnvironmentStore = create<EnvironmentState>((set) => ({
	snapshot: null,
	connectionState: "idle",

	setSnapshot: (snapshot) => {
		set({ snapshot });
	},

	setConnectionState: (connectionState) => {
		set({ connectionState });
	},
}));
