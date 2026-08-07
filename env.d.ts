/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_API_TIMEOUT?: string
  readonly VITE_TV_API_BASE_URL?: string
  readonly VITE_TV_APP_URL?: string
  readonly VITE_GAME_API_BASE_URL?: string
  readonly VITE_GAME_API_TARGET?: string
  readonly VITE_GAME_APP_URL?: string
  readonly VITE_GAME_API_KEY?: string
  readonly VITE_GAME_APP_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
