/// <reference types="next" />

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_WC_PROJECT_ID: string;
            NEXT_PUBLIC_ZKSYNC_RPC: string;
            NEXT_PUBLIC_ALCHEMY_ZKSYNC_RPC?: string;
        }
    }
}

export {};
