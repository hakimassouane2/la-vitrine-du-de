declare global {
	namespace NodeJS {
		interface ProcessEnv {
			GLOBAL_COOLDOWN: string
			MONGODB_URL: string
			PORT: string
			TWITCH_CHANNEL_ID: string
			TWITCH_EXTENSION_CLIENT_ID: string
			TWITCH_EXTENSION_CLIENT_SECRET: string
			TWITCH_EXTENSION_SECRET_KEY: string
			TWITCH_EXTENSION_VERSION: string
		}
	}
}

export {}
