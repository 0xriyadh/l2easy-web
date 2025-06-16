"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
    ArrowRight,
    Zap,
    Shield,
    Users,
    DollarSign,
    Code,
    Sparkles,
} from "lucide-react";
import { type UserWeights } from "@/lib/utils";

const questions = [
    {
        key: "Scalability" as keyof UserWeights,
        title: "Scalability",
        description: "High transaction throughput and fast processing",
        icon: Zap,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
    },
    {
        key: "Security" as keyof UserWeights,
        title: "Security",
        description: "Robust security and risk management",
        icon: Shield,
        color: "text-green-600",
        bgColor: "bg-green-50",
    },
    {
        key: "Decentralization" as keyof UserWeights,
        title: "Decentralization",
        description: "Decentralized governance and control",
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
    },
    {
        key: "Cost Efficiency" as keyof UserWeights,
        title: "Cost Efficiency",
        description: "Low transaction fees and operational costs",
        icon: DollarSign,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
    },
    {
        key: "Dev Experience" as keyof UserWeights,
        title: "Developer Experience",
        description: "Ease of development and tooling support",
        icon: Code,
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
    },
];

export default function Home() {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const [answers, setAnswers] = useState<UserWeights>({
        Scalability: 5,
        Security: 5,
        Decentralization: 5,
        "Cost Efficiency": 5,
        "Dev Experience": 5,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSliderChange = (
        questionKey: keyof UserWeights,
        value: number[]
    ) => {
        setAnswers((prev) => ({
            ...prev,
            [questionKey]: value[0],
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // Navigate to results page with answers
        const searchParams = new URLSearchParams();
        Object.entries(answers).forEach(([key, value]) => {
            searchParams.set(key, value.toString());
        });

        // Small delay for better UX
        setTimeout(() => {
            router.push(`/results?${searchParams.toString()}`);
        }, 500);
    };

    if (!mounted) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <Sparkles className="w-12 h-12 text-purple-600" />
                            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                L2Easy
                            </h1>
                        </div>
                        <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
                            Find your perfect blockchain match and deploy smart
                            contracts with confidence
                        </p>
                        <p className="text-gray-500">
                            Answer a few questions to get personalized network
                            recommendations
                        </p>
                    </div>

                    {/* Questionnaire Card */}
                    <Card className="shadow-2xl border-0 overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500" />
                        <CardHeader className="text-center pb-8">
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                What matters most to you?
                            </CardTitle>
                            <CardDescription className="text-lg text-gray-600">
                                Rate each factor from 1-10 based on your project
                                needs
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="px-8 pb-8">
                            <div className="space-y-8">
                                {questions.map((question) => {
                                    const Icon = question.icon;
                                    const currentValue = answers[question.key];

                                    return (
                                        <div
                                            key={question.key}
                                            className="space-y-4"
                                        >
                                            <div
                                                className={`p-4 rounded-xl ${question.bgColor} border border-gray-100`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div
                                                        className={`p-2 rounded-lg bg-white shadow-sm`}
                                                    >
                                                        <Icon
                                                            className={`w-6 h-6 ${question.color}`}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                {question.title}
                                                            </h3>
                                                            <span
                                                                className={`text-2xl font-bold ${question.color}`}
                                                            >
                                                                {currentValue}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-600 text-sm mb-4">
                                                            {
                                                                question.description
                                                            }
                                                        </p>

                                                        <div className="space-y-2">
                                                            <Slider
                                                                value={[
                                                                    currentValue,
                                                                ]}
                                                                onValueChange={(
                                                                    value
                                                                ) =>
                                                                    handleSliderChange(
                                                                        question.key,
                                                                        value
                                                                    )
                                                                }
                                                                max={10}
                                                                min={1}
                                                                step={1}
                                                                className="w-full"
                                                            />
                                                            <div className="flex justify-between text-xs text-gray-500">
                                                                <span>
                                                                    Not
                                                                    Important
                                                                </span>
                                                                <span>
                                                                    Very
                                                                    Important
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Submit Button */}
                                <div className="pt-8">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        size="lg"
                                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                                Finding Your Perfect Match...
                                            </>
                                        ) : (
                                            <>
                                                Get My Recommendations
                                                <ArrowRight className="ml-2 w-5 h-5" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Features Section */}
                    {/* <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Zap className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Smart Matching
                            </h3>
                            <p className="text-sm text-gray-600">
                                AI-powered recommendations based on your
                                specific needs
                            </p>
                        </div>

                        <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Secure Deployment
                            </h3>
                            <p className="text-sm text-gray-600">
                                Deploy with confidence on battle-tested networks
                            </p>
                        </div>

                        <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
                            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Code className="w-6 h-6 text-pink-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Developer Friendly
                            </h3>
                            <p className="text-sm text-gray-600">
                                Seamless development experience with
                                best-in-class tools
                            </p>
                        </div>
                    </div> */}
                </div>
            </div>
        </main>
    );
}
