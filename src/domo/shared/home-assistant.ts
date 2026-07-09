export type DomoConnectionState =
	| "idle"
	| "connecting"
	| "connected"
	| "disconnected"
	| "error";

export interface DomoEntityState {
	entityId: string;
	state: string;
	attributes: Readonly<Record<string, unknown>>;
	lastChanged: string;
	lastUpdated: string;
}

export interface DomoSnapshot {
	connectionState: DomoConnectionState;
	entities: Readonly<Record<string, DomoEntityState>>;
	error: string | null;
	revision: number;
}
