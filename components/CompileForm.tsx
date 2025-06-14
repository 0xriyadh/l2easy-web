"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    CompileFormSchema,
    CompileResponse,
    type CompileFormData,
    type CompileResponseType,
} from "@/lib/types";

export default function CompileForm() {
    const [compileResult, setCompileResult] =
        useState<CompileResponseType | null>(null);
    const [compileError, setCompileError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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

    return (
        <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">Solidity Compiler</h1>
                <p className="text-muted-foreground">
                    Enter your Solidity source code below and click compile to
                    get the ABI and bytecode.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="source" className="text-sm font-medium">
                        Solidity Source Code
                    </label>
                    <Textarea
                        id="source"
                        placeholder="// SPDX-License-Identifier: MIT&#10;pragma solidity ^0.8.0;&#10;&#10;contract MyContract {&#10;    // Your contract code here&#10;}"
                        className="min-h-[200px] font-mono text-sm"
                        {...register("source")}
                    />
                    {errors.source && (
                        <p className="text-sm text-destructive">
                            {errors.source.message}
                        </p>
                    )}
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
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
    );
}
