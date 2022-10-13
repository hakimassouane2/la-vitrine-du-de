/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
	readonly VITE_GLOBAL_COOLDOWN: string
	readonly VITE_WEBSOCKETS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
