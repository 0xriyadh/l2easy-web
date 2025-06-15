"use client";

import { useState, useEffect, Suspense } from "react";
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

function DeployContent() {
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
            <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-4xl mx-auto space-y-8 py-8">
                {/* Header */}
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

                {/* Title Section */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                        <Sparkles className="w-10 h-10 text-purple-600" />
                        Deploy Your Contract
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Compile and deploy your Solidity smart contract
                    </p>
                </div>

                {/* Network & Wallet Controls */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Network & Wallet
                            </h3>
                            <p className="text-sm text-gray-600">
                                Select your target network and connect your
                                wallet to deploy
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <NetworkSelector />
                            <WalletButton />
                        </div>
                    </div>
                </div>

                {/* Recommended Network Card */}
                {recommendedNetwork && (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">
                                    🎯
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-purple-800">
                                Recommended Network
                            </h3>
                        </div>
                        <p className="text-center text-purple-700 font-medium text-lg mb-1">
                            {recommendedNetwork}
                        </p>
                        <p className="text-center text-purple-600 text-sm">
                            Based on your preferences, this network is the best
                            match for your needs
                        </p>
                    </div>
                )}

                {/* Compile Form Card */}
                <div className="bg-white rounded-xl shadow-xl border-0 overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Smart Contract Source Code
                        </h2>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
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
                                    className="min-h-[300px] font-mono text-sm border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                                    {...register("source")}
                                />
                                {errors.source && (
                                    <p className="text-sm text-red-600">
                                        {errors.source.message}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                size="lg"
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 text-lg"
                            >
                                {isLoading
                                    ? "Compiling..."
                                    : "Compile Contract"}
                            </Button>

                            {errors.root && (
                                <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                                    <p className="text-sm text-red-800 font-medium mb-1">
                                        Compilation Error
                                    </p>
                                    <p className="text-sm text-red-700">
                                        {errors.root.message}
                                    </p>
                                </div>
                            )}

                            {compileError && (
                                <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                                    <p className="text-sm text-red-800 font-medium mb-1">
                                        Error
                                    </p>
                                    <p className="text-sm text-red-700">
                                        {compileError}
                                    </p>
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* Success & Deploy Section */}
                {compileResult && (
                    <div className="space-y-6">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm">
                                        ✓
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-green-800">
                                    Compilation Successful!
                                </h3>
                            </div>
                            <p className="text-center text-green-700">
                                Your contract is ready to deploy. Click the
                                button below to deploy it to the blockchain.
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <DeployButton
                                abi={compileResult.abi}
                                bytecode={compileResult.bytecode}
                                disabled={
                                    !compileResult.abi ||
                                    !compileResult.bytecode
                                }
                            />
                        </div>
                    </div>
                )}

                {/* Compilation Results */}
                {compileResult && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-xl border-0 overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    📋 ABI (Application Binary Interface)
                                </h2>
                                <div className="bg-gray-50 rounded-lg p-4 border max-h-64 overflow-y-auto">
                                    <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap">
                                        {JSON.stringify(
                                            compileResult.abi,
                                            null,
                                            2
                                        )}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-xl border-0 overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    🔧 Bytecode
                                </h2>
                                <div className="bg-gray-50 rounded-lg p-4 border max-h-64 overflow-y-auto">
                                    <pre className="text-sm font-mono text-gray-800 break-all whitespace-pre-wrap">
                                        {compileResult.bytecode}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default function DeployPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading...</p>
                    </div>
                </main>
            }
        >
            <DeployContent />
        </Suspense>
    );
}
