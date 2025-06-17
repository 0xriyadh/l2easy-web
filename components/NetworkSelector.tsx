"use client";

import { useState } from "react";
import { ChevronDown, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNetwork } from "@/lib/network-context";
import { useChainId, useSwitchChain, useAccount } from "wagmi";
import type { SupportedChainId } from "@/lib/wagmi";
import Image from "next/image";

export default function NetworkSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSwitching, setIsSwitching] = useState(false);
    const chainId = useChainId();
    const { isConnected } = useAccount();
    const { switchChain } = useSwitchChain();
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

        // Only auto-switch network when wallet is connected
        if (isConnected && switchChain && networkId !== chainId) {
            setIsSwitching(true);
            try {
                await switchChain({ chainId: networkId });
            } catch (error) {
                console.error("Failed to switch network:", error);
                // You can add toast notification here if desired
            } finally {
                setIsSwitching(false);
            }
        }
    };

    const getNetworkIcon = (networkId: SupportedChainId) => {
        const network = supportedNetworks[networkId];

        // Network-specific colors and icons
        const networkStyles = {
            11155111: {
                bg: "bg-gradient-to-r from-gray-600 to-gray-800",
                text: "text-white",
                icon: "/ethereum-icon.svg",
            }, // Ethereum Sepolia
            421614: {
                bg: "bg-gradient-to-r from-blue-500 to-cyan-500",
                text: "text-white",
                icon: "/arbitrum-icon.svg",
            }, // Arbitrum Sepolia
            11155420: {
                bg: "bg-gradient-to-r from-red-500 to-orange-500",
                text: "text-white",
                icon: "/optimism-icon.svg",
            }, // OP Sepolia
            84532: {
                bg: "bg-gradient-to-r from-blue-600 to-indigo-600",
                text: "text-white",
                icon: "/base-icon.png",
            }, // Base Sepolia
            300: {
                bg: "bg-gradient-to-r from-purple-500 to-pink-500",
                text: "text-white",
                icon: "/zksync-era-icon.svg",
            }, // zkSync Era Sepolia
        };

        const style = networkStyles[networkId as keyof typeof networkStyles];

        if (style) {
            return (
                <Image
                    src={style.icon}
                    alt={network.name}
                    width={25}
                    height={25}
                />
            );
        }

        // Fallback for unsupported networks
        return (
            <div
                className={`w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-700 shadow-sm`}
            >
                {network.name.charAt(0)}
            </div>
        );
    };

    return (
        <div className="relative">
            <Button
                variant="outline"
                onClick={() => setIsOpen(!isOpen)}
                disabled={isSwitching}
                className={`flex items-center gap-3 min-w-[200px] justify-between h-11 px-4 rounded-lg border-2 transition-all ${
                    !isCorrectNetwork
                        ? "border-orange-400 bg-orange-50 hover:bg-orange-100 shadow-sm"
                        : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                }`}
            >
                <div className="flex items-center gap-3">
                    {isSwitching ? (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    ) : (
                        getNetworkIcon(selectedNetwork.id as SupportedChainId)
                    )}
                    <div className="flex flex-col items-start min-w-0">
                        <span className="text-sm font-semibold text-gray-900 truncate">
                            {isSwitching
                                ? "Switching..."
                                : selectedNetwork.name}
                        </span>
                        {!isCorrectNetwork && !isSwitching && (
                            <span className="text-xs text-orange-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Click to switch
                            </span>
                        )}
                    </div>
                </div>
                <ChevronDown
                    className={`w-4 h-4 transition-transform text-gray-500 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </Button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
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
                                    disabled={isSwitching}
                                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0 transition-colors ${
                                        isSwitching
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    } ${isSelected ? "bg-blue-50" : ""}`}
                                >
                                    {getNetworkIcon(networkId)}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-gray-900 truncate">
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
