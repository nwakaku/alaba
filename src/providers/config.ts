import { createConfig } from "@privy-io/wagmi";
import { sepolia, flowMainnet } from "viem/chains";
import { http } from "wagmi";

export const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY as
  | string
  | undefined;

export const wagmiConfig = createConfig({
  chains: [sepolia, flowMainnet],
  transports: {
    [sepolia.id]: http(
      `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
    ),
    [flowMainnet.id]: http(
      `https://flow-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
    ),
  },
});

// Create a mapped type for chain IDs from wagmiConfig.chains
export type SupportedChainIds = (typeof wagmiConfig.chains)[number]["id"];
