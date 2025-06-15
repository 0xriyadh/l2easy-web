import { createConfig, http } from "wagmi";
import { walletConnect, injected } from "wagmi/connectors";
import {
    zkSyncSepoliaTestnet,
    arbitrumSepolia,
    optimismSepolia,
} from "viem/chains";

// RPC URLs for different networks
const zkSyncRpcUrl =
    process.env.NEXT_PUBLIC_ALCHEMY_ZKSYNC_RPC ??
    process.env.NEXT_PUBLIC_ZKSYNC_RPC!;
const arbitrumRpcUrl =
    process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC ??
    `https://sepolia-rollup.arbitrum.io/rpc`;
const optimismRpcUrl =
    process.env.NEXT_PUBLIC_OPTIMISM_SEPOLIA_RPC ??
    `https://sepolia.optimism.io`;

export const config = createConfig({
    chains: [zkSyncSepoliaTestnet, arbitrumSepolia, optimismSepolia],
    connectors:
        typeof window !== "undefined"
            ? [
                  injected({
                      target: "metaMask",
                  }),
                  walletConnect({
                      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
                      metadata: {
                          name: "Solidity Compiler",
                          description: "Compile and deploy Solidity contracts",
                          url: window.location.origin,
                          icons: [
                              "https://walletconnect.com/walletconnect-logo.png",
                          ],
                      },
                  }),
              ]
            : [],
    transports: {
        [zkSyncSepoliaTestnet.id]: http(zkSyncRpcUrl),
        [arbitrumSepolia.id]: http(arbitrumRpcUrl),
        [optimismSepolia.id]: http(optimismRpcUrl),
    },
    ssr: true,
});

// Network configuration for easy access
export const supportedNetworks = {
    [zkSyncSepoliaTestnet.id]: {
        ...zkSyncSepoliaTestnet,
        explorerUrl: "https://sepolia.explorer.zksync.io",
        rpcUrl: zkSyncRpcUrl,
    },
    [arbitrumSepolia.id]: {
        ...arbitrumSepolia,
        explorerUrl: "https://sepolia.arbiscan.io",
        rpcUrl: arbitrumRpcUrl,
    },
    [optimismSepolia.id]: {
        ...optimismSepolia,
        explorerUrl: "https://sepolia-optimism.etherscan.io",
        rpcUrl: optimismRpcUrl,
    },
} as const;

// Export individual chains for convenience
export {
    zkSyncSepoliaTestnet as zkSyncSepolia,
    arbitrumSepolia,
    optimismSepolia,
};
export type SupportedChainId = keyof typeof supportedNetworks;
