/// <reference types="next" />

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_WC_PROJECT_ID: string;
            NEXT_PUBLIC_ZKSYNC_RPC: string;
            NEXT_PUBLIC_ALCHEMY_ZKSYNC_RPC?: string;
            NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC?: string;
            NEXT_PUBLIC_OPTIMISM_SEPOLIA_RPC?: string;
            NEXT_PUBLIC_BASE_SEPOLIA_RPC?: string;
            NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC?: string;
        }
    }
}

export {};
