import { create } from "zustand";

import type { DomoServiceSnapshot } from "#/server/domo-service-snapshot";

type ConnectionState = "idle" | "connecting" | "connected" | "error";

interface DomoStoreState {
	snapshots: Record<string, DomoServiceSnapshot>;
	connectionState: ConnectionState;

	setSnapshot: (snapshotType: string, snapshot: DomoServiceSnapshot) => void;
	setConnectionState: (state: ConnectionState) => void;
}

export const useDomoStore = create<DomoStoreState>((set) => ({
	snapshots: {},
	connectionState: "idle",

	setSnapshot: (snapshotType: string, snapshot: DomoServiceSnapshot) => {
		set((state) => ({
			snapshots: { ...state.snapshots, [snapshotType]: snapshot },
		}));
	},

	setConnectionState: (connectionState) => {
		set({ connectionState });
	},
}));
