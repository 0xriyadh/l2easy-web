import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";

export const metadata: Metadata = {
    title: "Solidity Compiler",
    description: "A Next.js frontend for compiling Solidity smart contracts",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-background font-sans antialiased">
                <Providers>
                    <div className="relative flex min-h-screen flex-col">
                        <Header />
                        <div className="flex-1">{children}</div>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
