// app/domo/core/events/domo-event-bus.ts
import { EventEmitter } from "node:events";

import type { DomoEvent } from "./domo-event.types";

class DomoEventBus extends EventEmitter {
	emitEvent(event: DomoEvent) {
		this.emit("event", event);
	}

	onEvent(listener: (event: DomoEvent) => void) {
		this.on("event", listener);

		return () => {
			this.off("event", listener);
		};
	}
}

export const domoEventBus = new DomoEventBus();
