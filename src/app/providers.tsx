"use client";

import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "@/utils/wagmi";
import { ConnectWalletModalProvider } from "@/components/wallet-connection/connect-wallet-modal";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectWalletModalProvider>{children}</ConnectWalletModalProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
