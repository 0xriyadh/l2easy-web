"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { Button } from "@/components/ui/button";
import { formatEther } from "viem";
import Image from "next/image";
import WalletConnectIcon from "@/public/wallet-connect-icon.svg";
import MetaMaskIcon from "@/public/metamask-icon.svg";

export default function WalletButton() {
    const [mounted, setMounted] = useState(false);
    const [showConnectors, setShowConnectors] = useState(false);
    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const { data: balance } = useBalance({
        address: address,
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <Button disabled>Connect Wallet</Button>;
    }

    const handleConnect = (connectorId?: string) => {
        if (connectorId) {
            const connector = connectors.find((c) => c.id === connectorId);
            if (connector) {
                connect({ connector });
                setShowConnectors(false);
                return;
            }
        }

        // Auto-connect MetaMask if available, otherwise show options
        const metaMaskConnector = connectors.find(
            (connector) => connector.id === "injected"
        );

        if (
            metaMaskConnector &&
            typeof window !== "undefined" &&
            window.ethereum
        ) {
            connect({ connector: metaMaskConnector });
        } else {
            setShowConnectors(true);
        }
    };

    const truncateAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const getConnectorName = (connector: any) => {
        if (connector.id === "injected") return "MetaMask";
        if (connector.id === "walletConnect") return "WalletConnect";
        return connector.name;
    };

    const getConnectorIcon = (connector: any) => {
        // If connector has an icon, use it
        if (connector.icon) {
            return connector.icon;
        }

        if (connector.id === "walletConnect") {
            return WalletConnectIcon;
        }

        if (connector.id === "metaMask") {
            return MetaMaskIcon;
        }

        // Generic wallet icon for other connectors
        return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMgN1YxN0EyIDIgMCAwIDAgNSAxOUgxOUEyIDIgMCAwIDAgMjEgMTdWN0EyIDIgMCAwIDAgMTkgNUg1QTIgMiAwIDAgMCAzIDdaIiBzdHJva2U9IiM2NjY2NjYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xNiAxMUgxNkEyIDIgMCAwIDEgMTQgMTNWMTNBMiAyIDAgMCAxIDEyIDExSDE2WiIgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K";
    };

    // Filter out duplicate connectors (keep only unique ones by name)
    const uniqueConnectors = connectors.filter((connector, index, self) => {
        const connectorName = getConnectorName(connector);
        return (
            index ===
            self.findIndex((c) => getConnectorName(c) === connectorName)
        );
    });

    if (isConnected && address) {
        return (
            <div className="flex items-center gap-4">
                <div className="text-sm">
                    <div className="font-medium">
                        {truncateAddress(address)}
                    </div>
                    {balance && (
                        <div className="text-muted-foreground">
                            {parseFloat(formatEther(balance.value)).toFixed(4)}{" "}
                            ETH
                        </div>
                    )}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => disconnect()}
                >
                    Disconnect
                </Button>
            </div>
        );
    }

    if (showConnectors) {
        return (
            <div className="relative">
                <div className="flex flex-col gap-2 p-4 border rounded-lg bg-background shadow-lg min-w-[200px]">
                    <div className="text-sm font-medium mb-2">
                        Connect Wallet
                    </div>
                    {uniqueConnectors.map((connector) => (
                        <Button
                            key={connector.id}
                            variant="outline"
                            size="sm"
                            onClick={() => handleConnect(connector.id)}
                            className="justify-start gap-2"
                        >
                            <Image
                                src={getConnectorIcon(connector)}
                                alt={getConnectorName(connector)}
                                width={20}
                                height={20}
                                className="rounded-sm"
                            />
                            {getConnectorName(connector)}
                        </Button>
                    ))}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConnectors(false)}
                        className="mt-2"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        );
    }

    return <Button onClick={() => handleConnect()}>Connect Wallet</Button>;
}
