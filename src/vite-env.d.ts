/// <reference types="vite/client" />

interface Plausible {
  (event: string, options?: { props?: Record<string, unknown> }): void;
}

interface Window {
  plausible?: Plausible;
}
