/// <reference types="next" />

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            WC_PROJECT_ID: string;
            NEXT_PUBLIC_ZKSYNC_SEPOLIA_RPC: string;
            NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC: string;
            NEXT_PUBLIC_OPTIMISM_SEPOLIA_RPC: string;
            NEXT_PUBLIC_BASE_SEPOLIA_RPC: string;
            ETHEREUM_SEPOLIA_RPC: string;
            NEXT_PUBLIC_API_URL: string;
        }
    }
}

export {};
