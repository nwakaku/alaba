"use client";
import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "@privy-io/wagmi";
import { SmartWalletsProvider } from "@privy-io/react-auth/smart-wallets";
import { ThemeProvider, useTheme } from "./ThemeProvider";

import { wagmiConfig } from "./config";

export const queryClient = new QueryClient();

function InnerProviders({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const appId = import.meta.env.VITE_PRIVY_APP_ID as string | undefined;
  if (!appId) {
    throw new Error("Privy app ID is required");
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: theme,
          accentColor: "#676FFF",
          walletChainType: "ethereum-only",
        },
        embeddedWallets: {
          createOnLogin: "all-users",
        },
        supportedChains: [...wagmiConfig.chains],
      }}
    >
      <SmartWalletsProvider>
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
        </QueryClientProvider>
      </SmartWalletsProvider>
    </PrivyProvider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <InnerProviders>{children}</InnerProviders>
    </ThemeProvider>
  );
}
