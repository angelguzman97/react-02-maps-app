
/// <reference types="vite/client" />

declare module "*.css";

interface ImportMetaEnv {
    readonly VITE_ACCESS_TOKEN: string;
    readonly VITE_SESSION_TOKEN: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
