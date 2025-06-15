"use client";

import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi";

interface WagmiProviderProps {
    children: React.ReactNode;
}

export default function WagmiProviderComponent({
    children,
}: WagmiProviderProps) {
    return <WagmiProvider config={config}>{children}</WagmiProvider>;
}
