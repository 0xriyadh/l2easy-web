import { createConfig, http } from "wagmi";
import { walletConnect, injected } from "wagmi/connectors";
import { zkSyncSepoliaTestnet } from "viem/chains";

const rpcUrl =
    process.env.NEXT_PUBLIC_ALCHEMY_ZKSYNC_RPC ??
    process.env.NEXT_PUBLIC_ZKSYNC_RPC!;

export const config = createConfig({
    chains: [zkSyncSepoliaTestnet],
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
        [zkSyncSepoliaTestnet.id]: http(rpcUrl),
    },
    ssr: true,
});

// Re-export for convenience
export { zkSyncSepoliaTestnet as zkSyncSepolia };
