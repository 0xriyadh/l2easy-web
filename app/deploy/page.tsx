"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Sparkles } from "lucide-react";
import WalletButton from "@/components/WalletButton";
import DeployButton from "@/components/DeployButton";
import NetworkSelector from "@/components/NetworkSelector";
import {
    CompileFormSchema,
    CompileResponse,
    type CompileFormData,
    type CompileResponseType,
} from "@/lib/types";

// Network mapping
const networkMapping = {
    zksync: "ZkSync Era Sepolia",
    arbitrum: "Arbitrum Sepolia",
    optimism: "OP Sepolia",
} as const;

export default function DeployPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [mounted, setMounted] = useState(false);
    const [compileResult, setCompileResult] =
        useState<CompileResponseType | null>(null);
    const [compileError, setCompileError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [recommendedNetwork, setRecommendedNetwork] = useState<string | null>(
        null
    );

    useEffect(() => {
        setMounted(true);

        // Get recommended network from URL params
        const network = searchParams.get("network");
        if (network && network in networkMapping) {
            setRecommendedNetwork(
                networkMapping[network as keyof typeof networkMapping]
            );
        }
    }, [searchParams]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<CompileFormData>({
        resolver: zodResolver(CompileFormSchema),
    });

    const onSubmit = async (data: CompileFormData) => {
        setIsLoading(true);
        setCompileError(null);
        setCompileResult(null);

        try {
            const response = await fetch("http://localhost:9999/compile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ source: data.source }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Compile result:", result);

            // Validate response with Zod schema
            const validatedResult = CompileResponse.parse(result);
            setCompileResult(validatedResult);
        } catch (error) {
            if (error instanceof Error) {
                setCompileError(error.message);
                setError("root", { message: error.message });
            } else {
                setCompileError("An unknown error occurred");
                setError("root", { message: "An unknown error occurred" });
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) {
        return (
            <main className="container mx-auto py-8">
                <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="text-center flex-1">
                            <h1 className="text-3xl font-bold mb-2">
                                Deploy Your Contract
                            </h1>
                            <p className="text-muted-foreground">
                                Compile and deploy your Solidity smart contract
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                disabled
                                variant="outline"
                                className="min-w-[180px]"
                            >
                                Select Network
                            </Button>
                            <Button disabled>Connect Wallet</Button>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="container mx-auto py-8">
            <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
                {/* Header with Back Button */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Results
                    </Button>
                </div>

                {/* Header with Network Selection and Wallet Connection */}
                <div className="flex justify-between items-center">
                    <div className="text-center flex-1">
                        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
                            <Sparkles className="w-8 h-8 text-purple-600" />
                            Deploy Your Contract
                        </h1>
                        <p className="text-muted-foreground">
                            Compile and deploy your Solidity smart contract
                        </p>
                        {recommendedNetwork && (
                            <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                                <p className="text-sm text-purple-800 font-medium">
                                    🎯 Recommended Network:{" "}
                                    <span className="font-semibold">
                                        {recommendedNetwork}
                                    </span>
                                </p>
                                <p className="text-xs text-purple-600 mt-1">
                                    Based on your preferences, this network is
                                    the best match for your needs
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <NetworkSelector />
                        <WalletButton />
                    </div>
                </div>

                {/* Compile Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="source" className="text-sm font-medium">
                            Solidity Source Code
                        </label>
                        <Textarea
                            id="source"
                            placeholder={`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {
    string public message;
    
    constructor(string memory _message) {
        message = _message;
    }
    
    function setMessage(string memory _message) public {
        message = _message;
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
}`}
                            className="min-h-[300px] font-mono text-sm"
                            {...register("source")}
                        />
                        {errors.source && (
                            <p className="text-sm text-destructive">
                                {errors.source.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                        {isLoading ? "Compiling..." : "Compile Contract"}
                    </Button>

                    {errors.root && (
                        <div className="p-4 border border-destructive bg-destructive/10 rounded-md">
                            <p className="text-sm text-destructive font-medium">
                                Compilation Error
                            </p>
                            <p className="text-sm text-destructive">
                                {errors.root.message}
                            </p>
                        </div>
                    )}

                    {compileError && (
                        <div className="p-4 border border-destructive bg-destructive/10 rounded-md">
                            <p className="text-sm text-destructive font-medium">
                                Error
                            </p>
                            <p className="text-sm text-destructive">
                                {compileError}
                            </p>
                        </div>
                    )}
                </form>

                {/* Deploy Button */}
                {compileResult && (
                    <div className="space-y-4">
                        <div className="p-4 border border-green-200 bg-green-50 rounded-md">
                            <p className="text-sm text-green-800 font-medium">
                                ✅ Compilation Successful!
                            </p>
                            <p className="text-sm text-green-700">
                                Your contract is ready to deploy. Click the
                                button below to deploy it to the blockchain.
                            </p>
                        </div>
                        <DeployButton
                            abi={compileResult.abi}
                            bytecode={compileResult.bytecode}
                            disabled={
                                !compileResult.abi || !compileResult.bytecode
                            }
                        />
                    </div>
                )}

                {/* Compilation Results */}
                {compileResult && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                📋 ABI (Application Binary Interface)
                            </h2>
                            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono border max-h-64 overflow-y-auto">
                                {JSON.stringify(compileResult.abi, null, 2)}
                            </pre>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                🔧 Bytecode
                            </h2>
                            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono border break-all whitespace-pre-wrap max-h-64 overflow-y-auto">
                                {compileResult.bytecode}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
