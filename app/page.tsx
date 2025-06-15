"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import WalletButton from "@/components/WalletButton";
import DeployButton from "@/components/DeployButton";
import NetworkSelector from "@/components/NetworkSelector";
import {
    CompileFormSchema,
    CompileResponse,
    type CompileFormData,
    type CompileResponseType,
} from "@/lib/types";
import { useRouter } from "next/navigation";

export default function Home() {
    const [mounted, setMounted] = useState(false);
    const [compileResult, setCompileResult] =
        useState<CompileResponseType | null>(null);
    const [compileError, setCompileError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

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
            console.log("result3454", result);

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
                                Solidity Compiler
                            </h1>
                            <p className="text-muted-foreground">
                                Enter your Solidity source code below and click
                                compile to get the ABI and bytecode.
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
                {/* Header with Network Selection and Wallet Connection */}
                <div className="flex justify-between items-center">
                    <div className="text-center flex-1">
                        <h1 className="text-3xl font-bold mb-2">
                            Solidity Compiler
                        </h1>
                        <p className="text-muted-foreground">
                            Enter your Solidity source code below and click
                            compile to get the ABI and bytecode.
                        </p>
                        <div className="mt-4">
                            <Button
                                onClick={() => router.push("/questionnaire")}
                                variant="outline"
                                className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 text-purple-700 hover:from-purple-100 hover:to-blue-100"
                            >
                                🎯 Find Perfect Network for You
                            </Button>
                        </div>
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
    // Your contract code here
}`}
                            className="min-h-[200px] font-mono text-sm"
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
                        className="w-full"
                    >
                        {isLoading ? "Compiling..." : "Compile"}
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
                            <h2 className="text-xl font-semibold">
                                ABI (Application Binary Interface)
                            </h2>
                            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono border">
                                {JSON.stringify(compileResult.abi, null, 2)}
                            </pre>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold">Bytecode</h2>
                            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono border break-all whitespace-pre-wrap">
                                {compileResult.bytecode}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
