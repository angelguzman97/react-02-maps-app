
/// <reference types="vite/client" />

declare module "*.css";

interface ImportMetaEnv {
    readonly REACT_APP_ACCESS_TOKEN: string;
    readonly REACT_APP_SESSION_TOKEN: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
