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
	onConnectionReady(): Promise<void>;
	onConnected(): void;
	onDisconnected(): void;
	onEntitiesChanged(entities: HassEntities): void;
	onError(error: unknown): void;
}

export class HomeAssistantClient {
	private connection: Connection | null = null;
	private connectPromise: Promise<void> | null = null;
	private unsubscribeEntities: (() => void) | null = null;
	private initialized = false;

	public constructor(
		private readonly options: HomeAssistantClientOptions,
		private readonly listener: HomeAssistantClientListener,
	) {}

	public connect(beforeSubscribe?: () => Promise<void>): Promise<void> {
		if (this.initialized) {
			return Promise.resolve();
		}

		if (this.connectPromise) {
			return this.connectPromise;
		}

		this.connectPromise = this.createConnection(beforeSubscribe)
			.catch((error) => {
				this.connection = null;
				this.initialized = false;

				throw error;
			})
			.finally(() => {
				this.connectPromise = null;
			});

		return this.connectPromise;
	}

	public disconnect(): void {
		this.unsubscribeEntities?.();
		this.unsubscribeEntities = null;

		this.connection?.close();
		this.connection = null;
		this.initialized = false;

		this.listener.onDisconnected();
	}

	public async callService(
		domain: string,
		service: string,
		serviceData?: Record<string, unknown>,
		target?: Record<string, unknown>,
	): Promise<void> {
		const connection = this.requireConnection();

		await callService(connection, domain, service, serviceData, target);
	}

	public async sendCommand<TResult>(message: MessageBase): Promise<TResult> {
		const connection = this.getConnection();

		return connection.sendMessagePromise<TResult>(message);
	}

	public getConnection(): Connection {
		if (!this.connection) {
			throw new Error("Home Assistant connection is not available.");
		}

		return this.connection;
	}

	private async waitForInitialEntities(connection: Connection): Promise<void> {
		let resolveInitialEntities!: () => void;

		const initialEntitiesPromise = new Promise<void>((resolve) => {
			resolveInitialEntities = resolve;
		});

		let initialized = false;

		this.unsubscribeEntities = await subscribeEntities(connection, (entities) => {
			this.listener.onEntitiesChanged(entities);

			if (!initialized) {
				initialized = true;
				resolveInitialEntities();
			}
		});

		await initialEntitiesPromise;
	}

	private async createConnection(
		beforeSubscribe?: () => Promise<void>,
	): Promise<void> {
		try {
			const auth = createLongLivedTokenAuth(this.options.url, this.options.token);

			const connection = await createConnection({ auth });

			this.connection = connection;

			connection.addEventListener("disconnected", () => {
				this.initialized = false;
				this.listener.onDisconnected();
			});

			await beforeSubscribe?.();

			await this.waitForInitialEntities(connection);

			this.initialized = true;
			this.listener.onConnected();
		} catch (error) {
			this.connection = null;
			this.initialized = false;

			this.listener.onError(error);

			throw error;
		}
	}

	private requireConnection(): Connection {
		if (!this.connection) {
			throw new Error("Home Assistant is not connected");
		}

		return this.connection;
	}
}
