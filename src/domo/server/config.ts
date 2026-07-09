function requireEnvironmentVariable(name: string): string {
	const value = process.env[name]?.trim();

	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	return value;
}

export interface DomoServerConfig {
	homeAssistantUrl: string;
	homeAssistantToken: string;
}

export function getDomoServerConfig(): DomoServerConfig {
	return {
		homeAssistantUrl: requireEnvironmentVariable("HOME_ASSISTANT_URL"),
		homeAssistantToken: requireEnvironmentVariable("HOME_ASSISTANT_TOKEN"),
	};
}
