"use client";

import { useState } from "react";
import { ChevronDown, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNetwork } from "@/lib/network-context";
import type { SupportedChainId } from "@/lib/wagmi";

export default function NetworkSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const {
        selectedNetwork,
        setSelectedNetwork,
        supportedNetworks,
        isCorrectNetwork,
        switchToSelectedNetwork,
    } = useNetwork();

    const handleNetworkSelect = async (networkId: SupportedChainId) => {
        setSelectedNetwork(networkId);
        setIsOpen(false);

        // Auto-switch network if wallet is connected but on wrong network
        if (!isCorrectNetwork) {
            await switchToSelectedNetwork();
        }
    };

    const getNetworkIcon = (networkId: SupportedChainId) => {
        const network = supportedNetworks[networkId];
        // You can add custom icons here later
        return (
            <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-bold">
                {network.name.charAt(0)}
            </div>
        );
    };

    return (
        <div className="relative">
            <Button
                variant="outline"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 min-w-[180px] justify-between ${
                    !isCorrectNetwork ? "border-orange-500 bg-orange-50" : ""
                }`}
            >
                <div className="flex items-center gap-2">
                    {getNetworkIcon(selectedNetwork.id as SupportedChainId)}
                    <span className="truncate">{selectedNetwork.name}</span>
                    {!isCorrectNetwork && (
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                    )}
                </div>
                <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </Button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    {Object.entries(supportedNetworks).map(
                        ([chainId, network]) => {
                            const networkId = parseInt(
                                chainId
                            ) as SupportedChainId;
                            const isSelected = networkId === selectedNetwork.id;

                            return (
                                <button
                                    key={chainId}
                                    onClick={() =>
                                        handleNetworkSelect(networkId)
                                    }
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                                >
                                    {getNetworkIcon(networkId)}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">
                                            {network.name}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate">
                                            {network.nativeCurrency.symbol}
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <Check className="w-4 h-4 text-green-600" />
                                    )}
                                </button>
                            );
                        }
                    )}
                </div>
            )}

            {!isCorrectNetwork && (
                <div className="mt-2 text-sm text-orange-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Switch to {selectedNetwork.name} to deploy
                </div>
            )}

            {/* Click outside to close */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
