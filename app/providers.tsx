"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Dynamically import WagmiProvider to prevent SSR issues
const WagmiProviderComponent = dynamic(() => import("./wagmi-provider"), {
    ssr: false,
});

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                    },
                },
            })
    );

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <WagmiProviderComponent>{children}</WagmiProviderComponent>
        </QueryClientProvider>
    );
}
