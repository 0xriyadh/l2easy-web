"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { Button } from "@/components/ui/button";
import { formatEther } from "viem";

export default function WalletButton() {
    const [mounted, setMounted] = useState(false);
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

    const handleConnect = () => {
        const walletConnectConnector = connectors.find(
            (connector) => connector.type === "walletConnect"
        );
        if (walletConnectConnector) {
            connect({ connector: walletConnectConnector });
        }
    };

    const truncateAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

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

    return <Button onClick={handleConnect}>Connect Wallet</Button>;
}
