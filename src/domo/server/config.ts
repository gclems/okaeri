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

	latitude: number;
	longitude: number;
	timezone: string;
	metNoUserAgent: string;
}

export function getDomoServerConfig(): DomoServerConfig {
	return {
		homeAssistantUrl: requireEnvironmentVariable("HOME_ASSISTANT_URL"),
		homeAssistantToken: requireEnvironmentVariable("HOME_ASSISTANT_TOKEN"),
		latitude: parseFloat(requireEnvironmentVariable("LATITUDE")),
		longitude: parseFloat(requireEnvironmentVariable("LONGITUDE")),
		timezone: requireEnvironmentVariable("TIMEZONE"),
		metNoUserAgent: requireEnvironmentVariable("MET_NO_USER_AGENT"),
	};
}
