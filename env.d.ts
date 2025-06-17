/// <reference types="next" />

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            WC_PROJECT_ID: string;
            ZKSYNC_SEPOLIA_RPC: string;
            ARBITRUM_SEPOLIA_RPC?: string;
            OPTIMISM_SEPOLIA_RPC?: string;
            BASE_SEPOLIA_RPC?: string;
            ETHEREUM_SEPOLIA_RPC?: string;
        }
    }
}

export {};
