import { createConfig, http } from "wagmi";
import { walletConnect, injected } from "wagmi/connectors";
import {
    zkSyncSepoliaTestnet,
    arbitrumSepolia,
    optimismSepolia,
    baseSepolia,
    sepolia,
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
const baseRpcUrl =
    process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC ?? `https://sepolia.base.org`;
const ethereumRpcUrl =
    process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC ??
    `https://ethereum-sepolia-rpc.publicnode.com`;

export const config = createConfig({
    chains: [
        zkSyncSepoliaTestnet,
        arbitrumSepolia,
        optimismSepolia,
        baseSepolia,
        sepolia,
    ],
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
        [baseSepolia.id]: http(baseRpcUrl),
        [sepolia.id]: http(ethereumRpcUrl),
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
    [baseSepolia.id]: {
        ...baseSepolia,
        explorerUrl: "https://sepolia.basescan.org",
        rpcUrl: baseRpcUrl,
    },
    [sepolia.id]: {
        ...sepolia,
        explorerUrl: "https://sepolia.etherscan.io",
        rpcUrl: ethereumRpcUrl,
    },
} as const;

// Export individual chains for convenience
export {
    zkSyncSepoliaTestnet as zkSyncSepolia,
    arbitrumSepolia,
    optimismSepolia,
    baseSepolia,
    sepolia as ethereumSepolia,
};

export type SupportedChainId = keyof typeof supportedNetworks;
