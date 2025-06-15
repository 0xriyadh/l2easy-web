"use client";

import { useState } from "react";
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
import { ArrowRight, ArrowLeft } from "lucide-react";
import { type UserWeights } from "@/lib/utils";

const questions = [
    {
        key: "Scalability" as keyof UserWeights,
        title: "Scalability",
        description:
            "How important is high transaction throughput and fast processing?",
    },
    {
        key: "Security" as keyof UserWeights,
        title: "Security",
        description: "How important is robust security and risk management?",
    },
    {
        key: "Decentralization" as keyof UserWeights,
        title: "Decentralization",
        description: "How important is decentralized governance and control?",
    },
    {
        key: "Cost Efficiency" as keyof UserWeights,
        title: "Cost Efficiency",
        description:
            "How important are low transaction fees and operational costs?",
    },
    {
        key: "Dev Experience" as keyof UserWeights,
        title: "Developer Experience",
        description:
            "How important is ease of development and tooling support?",
    },
];

export default function QuestionnairePage() {
    const router = useRouter();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<UserWeights>({
        Scalability: 5,
        Security: 5,
        Decentralization: 5,
        "Cost Efficiency": 5,
        "Dev Experience": 5,
    });

    const handleSliderChange = (value: number[]) => {
        const questionKey = questions[currentQuestion].key;
        setAnswers((prev) => ({
            ...prev,
            [questionKey]: value[0],
        }));
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Navigate to results page with answers
            const searchParams = new URLSearchParams();
            Object.entries(answers).forEach(([key, value]) => {
                searchParams.set(key, value.toString());
            });
            router.push(`/results?${searchParams.toString()}`);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const currentQ = questions[currentQuestion];
    const currentValue = answers[currentQ.key];

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <Card className="shadow-xl border-0">
                    <CardHeader className="text-center pb-8">
                        <CardTitle className="text-3xl font-bold text-gray-900">
                            Find Your Perfect Blockchain
                        </CardTitle>
                        <CardDescription className="text-lg text-gray-600 mt-2">
                            Answer a few questions to get personalized
                            recommendations
                        </CardDescription>
                        <div className="flex justify-center mt-6">
                            <div className="flex space-x-2">
                                {questions.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                                            index <= currentQuestion
                                                ? "bg-blue-600"
                                                : "bg-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="px-8 pb-8">
                        <div className="space-y-8">
                            <div className="text-center">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                                    {currentQ.title}
                                </h2>
                                <p className="text-gray-600 mb-8">
                                    {currentQ.description}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="px-4">
                                    <Slider
                                        value={[currentValue]}
                                        onValueChange={handleSliderChange}
                                        max={10}
                                        min={1}
                                        step={1}
                                        className="w-full"
                                    />
                                </div>

                                <div className="flex justify-between text-sm text-gray-500 px-4">
                                    <span>Not Important</span>
                                    <span className="font-semibold text-lg text-blue-600">
                                        {currentValue}/10
                                    </span>
                                    <span>Very Important</span>
                                </div>
                            </div>

                            <div className="flex justify-between pt-8">
                                <Button
                                    variant="outline"
                                    onClick={handlePrevious}
                                    disabled={currentQuestion === 0}
                                    className="flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Previous
                                </Button>

                                <span className="text-sm text-gray-500 self-center">
                                    {currentQuestion + 1} of {questions.length}
                                </span>

                                <Button
                                    onClick={handleNext}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                                >
                                    {currentQuestion === questions.length - 1
                                        ? "Get Results"
                                        : "Next"}
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
