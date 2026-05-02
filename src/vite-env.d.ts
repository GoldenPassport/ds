/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Injected via Vite `define` in the desktop-dark Vitest project so that
  // preview.tsx can set initialGlobals.theme without a runtime cast.
  readonly STORYBOOK_THEME?: string;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}
