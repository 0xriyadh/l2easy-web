import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface ProtocolData {
    [key: string]: {
        TPS: number;
        Liveness: number;
        Risk: number;
        TVL: number;
        Finality: number;
        Stage: number;
        Cost: number;
        EVM: number;
        Language: number;
    };
}

export interface UserWeights {
    Scalability: number;
    Security: number;
    Decentralization: number;
    "Cost Efficiency": number;
    "Dev Experience": number;
}

export const protocolData: ProtocolData = {
    Optimism: {
        TPS: 0.558,
        Liveness: 0.5125,
        Risk: 0.667,
        TVL: 0.197,
        Finality: 1,
        Stage: 1,
        Cost: 0.672,
        EVM: 1,
        Language: 1,
    },
    Arbitrum: {
        TPS: 1,
        Liveness: 0.5,
        Risk: 1.0,
        TVL: 1.0,
        Finality: 0.905,
        Stage: 1,
        Cost: 0.437,
        EVM: 1,
        Language: 1,
    },
    StarkNet: {
        TPS: 0.334,
        Liveness: 0.5,
        Risk: 0.333,
        TVL: 0.00325,
        Finality: 0,
        Stage: 1,
        Cost: 1.0,
        EVM: 0,
        Language: 0,
    },
    ZkSync: {
        TPS: 0,
        Liveness: 0.6215,
        Risk: 0.0,
        TVL: 0,
        Finality: 0.018,
        Stage: 0,
        Cost: 0.0,
        EVM: 1,
        Language: 1,
    },
    // Base: {
    //     TPS: 0,
    //     Liveness: 0,
    //     Risk: 0,
    //     TVL: 0,
    //     Finality: 0,
    //     Stage: 0,
    //     Cost: 0,
    //     EVM: 0,
    //     Language: 0,
    // },
    // Ethereum: {
    //     TPS: 0,
    //     Liveness: 0,
    //     Risk: 0,
    //     TVL: 0,
    //     Finality: 0,
    //     Stage: 0,
    //     Cost: 0,
    //     EVM: 0,
    //     Language: 0,
    // },
};

export function calculateFinalScores(userWeights: UserWeights) {
    const stageMapping = { 0: 0.0, 1: 0.5, 2: 1.0 };
    const finalScores: { [key: string]: number } = {};

    for (const protocolName in protocolData) {
        const metrics = protocolData[protocolName];

        const scalability = (metrics.TPS + metrics.Liveness) / 2;
        const security = (metrics.Risk + metrics.TVL + metrics.Finality) / 3;
        const decentralization = stageMapping[metrics.Stage as 0 | 1 | 2];
        const costEfficiency = metrics.Cost;
        const devExperience = (metrics.EVM + metrics.Language) / 2;

        const weightedScore =
            userWeights["Scalability"] * scalability +
            userWeights["Security"] * security +
            userWeights["Decentralization"] * decentralization +
            userWeights["Cost Efficiency"] * costEfficiency +
            userWeights["Dev Experience"] * devExperience;

        const finalScore = Number((weightedScore / 5).toFixed(4));
        finalScores[protocolName] = finalScore;
    }

    return finalScores;
}
