/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

/* Fallback declaration in case TS still complains */
declare module 'virtual:pwa-register' {
  export function registerSW(options?: { immediate?: boolean }): () => void;
}
