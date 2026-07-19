import {
	type Connection,
	type HassEntities,
	type MessageBase,
	callService,
	createConnection,
	createLongLivedTokenAuth,
	subscribeEntities,
} from "home-assistant-js-websocket";

export interface HomeAssistantClientOptions {
	url: string;
	token: string;
}

export interface HomeAssistantClientListener {
	onDisconnected(): void;
	onEntitiesChanged(entities: HassEntities): void;
	onError(error: unknown): void;
}

export class HomeAssistantClient {
	private connection: Connection | null = null;
	private unsubscribeEntities: (() => void) | null = null;
	private connected = false;

	public constructor(
		private readonly options: HomeAssistantClientOptions,
		private readonly listener: HomeAssistantClientListener,
	) {}

	public async connect(): Promise<void> {
		const auth = createLongLivedTokenAuth(this.options.url, this.options.token);

		const connection = await createConnection({ auth });

		this.connection = connection;

		connection.addEventListener("disconnected", () => {
			this.handleDisconnected();
		});
	}

	public disconnect(): void {
		this.cleanup();
		this.listener.onDisconnected();
	}

	public callService(
		domain: string,
		service: string,
		serviceData?: Record<string, unknown>,
		target?: Record<string, unknown>,
	): Promise<unknown> {
		return callService(
			this.requireConnection(),
			domain,
			service,
			serviceData,
			target,
		);
	}

	public sendCommand<TResult>(message: MessageBase): Promise<TResult> {
		return this.requireConnection().sendMessagePromise<TResult>(message);
	}

	public getConnection(): Connection {
		return this.requireConnection();
	}

	public async subscribeToEntities(): Promise<void> {
		let initialSnapshotReceived = false;
		let resolveInitialSnapshot!: () => void;

		const initialSnapshotPromise = new Promise<void>((resolve) => {
			resolveInitialSnapshot = resolve;
		});

		this.unsubscribeEntities = await subscribeEntities(
			this.requireConnection(),
			(entities) => {
				this.listener.onEntitiesChanged(entities);

				if (!initialSnapshotReceived) {
					initialSnapshotReceived = true;
					resolveInitialSnapshot();
				}
			},
		);

		await initialSnapshotPromise;
	}

	private handleDisconnected(): void {
		if (!this.connected && !this.connection) {
			return;
		}

		this.cleanup();
		this.listener.onDisconnected();
	}

	private cleanup(): void {
		this.unsubscribeEntities?.();
		this.unsubscribeEntities = null;

		this.connection?.close();
		this.connection = null;

		this.connected = false;
	}

	private requireConnection(): Connection {
		if (!this.connection) {
			throw new Error("Home Assistant is not connected.");
		}

		return this.connection;
	}
}
