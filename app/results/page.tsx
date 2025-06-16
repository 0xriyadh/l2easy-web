"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Trophy,
    ArrowRight,
    Zap,
    Shield,
    Users,
    DollarSign,
    Code,
} from "lucide-react";
import { calculateFinalScores, type UserWeights } from "@/lib/utils";

// Map protocol names to supported networks
const protocolToNetwork = {
    ZkSync: "zksync",
    Arbitrum: "arbitrum",
    Optimism: "optimism",
    Base: "base",
    Ethereum: "ethereum",
} as const;

const protocolIcons = {
    ZkSync: "Z",
    Arbitrum: "A",
    Optimism: "O",
    Base: "B",
    Ethereum: "E",
};

const protocolColors = {
    ZkSync: "from-purple-500 to-pink-500",
    Arbitrum: "from-blue-500 to-cyan-500",
    Optimism: "from-red-500 to-orange-500",
    Base: "from-blue-600 to-indigo-600",
    Ethereum: "from-gray-600 to-gray-800",
};

const categoryIcons = {
    Scalability: Zap,
    Security: Shield,
    Decentralization: Users,
    "Cost Efficiency": DollarSign,
    "Dev Experience": Code,
};

// Create a separate component for the search params logic
function ResultsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [results, setResults] = useState<
        { protocol: string; score: number }[]
    >([]);
    const [userWeights, setUserWeights] = useState<UserWeights | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Parse user weights from URL params
        const weights: UserWeights = {
            Scalability: parseInt(searchParams.get("Scalability") || "5"),
            Security: parseInt(searchParams.get("Security") || "5"),
            Decentralization: parseInt(
                searchParams.get("Decentralization") || "5"
            ),
            "Cost Efficiency": parseInt(
                searchParams.get("Cost Efficiency") || "5"
            ),
            "Dev Experience": parseInt(
                searchParams.get("Dev Experience") || "5"
            ),
        };

        setUserWeights(weights);

        // Calculate scores
        const scores = calculateFinalScores(weights);

        // Filter only supported protocols and sort by score
        const supportedProtocols = Object.keys(protocolToNetwork);
        const sortedResults = supportedProtocols
            .map((protocol) => ({
                protocol,
                score: scores[protocol] || 0,
            }))
            .sort((a, b) => b.score - a.score);

        setResults(sortedResults);
        setIsLoading(false);
    }, [searchParams]);

    const handleDeploy = (protocol: string) => {
        const networkKey =
            protocolToNetwork[protocol as keyof typeof protocolToNetwork];
        router.push(`/deploy?network=${networkKey}`);
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        Calculating your perfect match...
                    </p>
                </div>
            </main>
        );
    }

    const topProtocol = results[0];

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-4xl mx-auto space-y-8 py-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Your Perfect Match! 🎉
                    </h1>
                    <p className="text-lg text-gray-600">
                        Based on your preferences, here's our recommendation
                    </p>
                </div>

                {/* Winner Card */}
                <Card className="border-0 shadow-2xl overflow-hidden">
                    <div
                        className={`h-2 bg-gradient-to-r ${
                            protocolColors[
                                topProtocol.protocol as keyof typeof protocolColors
                            ]
                        }`}
                    />
                    <CardHeader className="text-center pb-6">
                        <div className="flex justify-center mb-4">
                            <div
                                className={`w-20 h-20 rounded-full bg-gradient-to-r ${
                                    protocolColors[
                                        topProtocol.protocol as keyof typeof protocolColors
                                    ]
                                } flex items-center justify-center text-white text-3xl font-bold shadow-lg`}
                            >
                                {
                                    protocolIcons[
                                        topProtocol.protocol as keyof typeof protocolIcons
                                    ]
                                }
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
                            <Trophy className="w-8 h-8 text-yellow-500" />
                            {topProtocol.protocol}
                        </CardTitle>
                        <CardDescription className="text-xl text-gray-600 mt-2">
                            Match Score: {topProtocol.score.toFixed(1)}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center pb-8">
                        <p className="text-gray-700 mb-6 text-lg">
                            This blockchain best aligns with your priorities and
                            requirements.
                        </p>
                        <Button
                            onClick={() => handleDeploy(topProtocol.protocol)}
                            size="lg"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
                        >
                            Deploy on {topProtocol.protocol}
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Your Priorities */}
                {userWeights && (
                    <Card className="shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-2xl text-gray-900">
                                Your Priorities
                            </CardTitle>
                            <CardDescription>
                                How you rated each category
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(userWeights).map(
                                    ([category, value]) => {
                                        const Icon =
                                            categoryIcons[
                                                category as keyof typeof categoryIcons
                                            ];
                                        return (
                                            <div
                                                key={category}
                                                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                                            >
                                                <Icon className="w-6 h-6 text-blue-600" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">
                                                        {category}
                                                    </p>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-600 h-2 rounded-full"
                                                                style={{
                                                                    width: `${
                                                                        (value /
                                                                            10) *
                                                                        100
                                                                    }%`,
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-semibold text-gray-700">
                                                            {value}/10
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* All Results */}
                <Card className="shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl text-gray-900">
                            All Recommendations
                        </CardTitle>
                        <CardDescription>
                            How each blockchain scored based on your preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {results?.map((result, index) => (
                                <div
                                    key={result.protocol}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-2xl font-bold text-gray-400">
                                                #{index + 1}
                                            </span>
                                            <div
                                                className={`w-12 h-12 rounded-full bg-gradient-to-r ${
                                                    protocolColors[
                                                        result.protocol as keyof typeof protocolColors
                                                    ]
                                                } flex items-center justify-center text-white text-lg font-bold`}
                                            >
                                                {
                                                    protocolIcons[
                                                        result.protocol as keyof typeof protocolIcons
                                                    ]
                                                }
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">
                                                {result.protocol}
                                            </h3>
                                            <p className="text-gray-600">
                                                {result.score === 0 ? (
                                                    "Coming soon..."
                                                ) : (
                                                    <span>
                                                        {" "}
                                                        Match Score:{" "}
                                                        {result.score.toFixed(
                                                            1
                                                        )}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() =>
                                            handleDeploy(result.protocol)
                                        }
                                        variant={
                                            index === 0 ? "default" : "outline"
                                        }
                                        className={
                                            index === 0
                                                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                                : ""
                                        }
                                    >
                                        {index === 0
                                            ? "Deploy Now"
                                            : "Deploy Here"}
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Retake Survey */}
                <div className="text-center">
                    <Button
                        variant="outline"
                        onClick={() => router.push("/")}
                        className="text-gray-600 border-gray-300 hover:bg-gray-50"
                    >
                        Retake Survey
                    </Button>
                </div>
            </div>
        </main>
    );
}

export default function ResultsPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">
                            Calculating your perfect match...
                        </p>
                    </div>
                </main>
            }
        >
            <ResultsContent />
        </Suspense>
    );
}
