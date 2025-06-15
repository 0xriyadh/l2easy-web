"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useChainId, useSwitchChain } from "wagmi";
import { supportedNetworks, type SupportedChainId } from "./wagmi";

interface NetworkContextType {
    selectedNetworkId: SupportedChainId;
    selectedNetwork: (typeof supportedNetworks)[SupportedChainId];
    setSelectedNetwork: (networkId: SupportedChainId) => void;
    supportedNetworks: typeof supportedNetworks;
    isCorrectNetwork: boolean;
    switchToSelectedNetwork: () => Promise<void>;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();

    // Default to zkSync Era Sepolia
    const [selectedNetworkId, setSelectedNetworkId] =
        useState<SupportedChainId>(
            Number(Object.keys(supportedNetworks)[0]) as SupportedChainId
        );

    // Remove the automatic network switching when wallet connects
    // This preserves the user's network selection

    const selectedNetwork = supportedNetworks[selectedNetworkId];
    const isCorrectNetwork = chainId === selectedNetworkId;

    const setSelectedNetwork = (networkId: SupportedChainId) => {
        setSelectedNetworkId(networkId);
    };

    const switchToSelectedNetwork = async () => {
        if (switchChain && selectedNetworkId !== chainId) {
            try {
                await switchChain({ chainId: selectedNetworkId });
            } catch (error) {
                console.error("Failed to switch network:", error);
            }
        }
    };

    const value: NetworkContextType = {
        selectedNetworkId,
        selectedNetwork,
        setSelectedNetwork,
        supportedNetworks,
        isCorrectNetwork,
        switchToSelectedNetwork,
    };

    return (
        <NetworkContext.Provider value={value}>
            {children}
        </NetworkContext.Provider>
    );
}

export function useNetwork() {
    const context = useContext(NetworkContext);
    if (context === undefined) {
        throw new Error("useNetwork must be used within a NetworkProvider");
    }
    return context;
}
