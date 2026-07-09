import { useEffect } from "react";

import { initHomeAssistantWebSocket } from "../ha-adapter/ha-websocket-client";

function DomoProvider({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		let socket: WebSocket | null = null;

		initHomeAssistantWebSocket().then((ws) => {
			socket = ws;
		});

		return () => {
			socket?.close();
		};
	}, []);

	return <>{children}</>;
}

export { DomoProvider };
