"use client";

import { useState, useEffect } from "react";
import {
    useAccount,
    useWalletClient,
    useWaitForTransactionReceipt,
    usePublicClient,
} from "wagmi";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink } from "lucide-react";
import { type Abi, type Hash } from "viem";
import { useNetwork } from "@/lib/network-context";

interface DeployButtonProps {
    abi: Abi;
    bytecode: string;
    disabled?: boolean;
}

export default function DeployButton({
    abi,
    bytecode,
    disabled,
}: DeployButtonProps) {
    const [mounted, setMounted] = useState(false);
    const { address, isConnected } = useAccount();
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();
    const { selectedNetwork, isCorrectNetwork } = useNetwork();
    const [txHash, setTxHash] = useState<Hash | null>(null);
    const [contractAddress, setContractAddress] = useState<string | null>(null);
    const [isDeploying, setIsDeploying] = useState(false);
    const [deployError, setDeployError] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt(
        {
            hash: txHash || undefined,
        }
    );

    const handleDeploy = async () => {
        if (!walletClient || !address || !publicClient) return;

        setIsDeploying(true);
        setDeployError(null);
        setTxHash(null);
        setContractAddress(null);

        try {
            const hash = await walletClient.deployContract({
                abi,
                bytecode: bytecode.startsWith("0x")
                    ? (bytecode as `0x${string}`)
                    : (`0x${bytecode}` as `0x${string}`),
                account: address,
            });

            setTxHash(hash);

            // Wait for the transaction receipt to get contract address
            const receipt = await publicClient.waitForTransactionReceipt({
                hash,
            });
            if (receipt.contractAddress) {
                setContractAddress(receipt.contractAddress);
            }
        } catch (error) {
            console.error("Deployment error:", error);
            setDeployError(
                error instanceof Error ? error.message : "Deployment failed"
            );
        } finally {
            setIsDeploying(false);
        }
    };

    if (!mounted) {
        return (
            <Button disabled className="w-full">
                Deploy Contract
            </Button>
        );
    }

    const isButtonDisabled =
        disabled ||
        !isConnected ||
        !abi ||
        !bytecode ||
        isDeploying ||
        isConfirming ||
        !isCorrectNetwork;

    return (
        <div className="space-y-4">
            <Button
                onClick={handleDeploy}
                disabled={isButtonDisabled}
                className="w-full"
            >
                {isDeploying || isConfirming ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isDeploying ? "Deploying..." : "Confirming..."}
                    </>
                ) : (
                    "Deploy Contract"
                )}
            </Button>

            {deployError && (
                <div className="p-4 border border-destructive bg-destructive/10 rounded-md">
                    <p className="text-sm text-destructive font-medium">
                        Deployment Error
                    </p>
                    <p className="text-sm text-destructive">{deployError}</p>
                </div>
            )}

            {!isCorrectNetwork && isConnected && (
                <div className="p-4 border border-orange-200 bg-orange-50 rounded-md">
                    <p className="text-sm text-orange-800 font-medium">
                        Wrong Network
                    </p>
                    <p className="text-sm text-orange-700">
                        Please switch to {selectedNetwork.name} to deploy your
                        contract.
                    </p>
                </div>
            )}

            {txHash && (
                <div className="space-y-2">
                    <div className="p-4 border border-border bg-muted/50 rounded-md">
                        <p className="text-sm font-medium">Transaction Hash:</p>
                        <div className="flex items-center gap-2 mt-1">
                            <code className="text-xs bg-background px-2 py-1 rounded border font-mono break-all">
                                {txHash}
                            </code>
                            <a
                                href={`${selectedNetwork.explorerUrl}/tx/${txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80"
                            >
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {isSuccess && contractAddress && (
                        <div className="p-4 border border-green-200 bg-green-50 rounded-md">
                            <p className="text-sm font-medium text-green-800">
                                Contract Deployed Successfully!
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <code className="text-xs bg-white px-2 py-1 rounded border font-mono break-all text-green-700">
                                    {contractAddress}
                                </code>
                                <a
                                    href={`${selectedNetwork.explorerUrl}/address/${contractAddress}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-500"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
