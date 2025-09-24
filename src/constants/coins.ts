import { Token } from "@/types";
import { sepolia, hedera, flowMainnet } from "viem/chains";

export const USDC = {
  name: "USDC",
  icon: "/crypto-icons/usdc.svg",
  decimals: 6,
  isNativeToken: false,
  chains: {
    [sepolia.id]: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    [hedera.id]: "0x000000000000000000000000000000000006f89a",
    [flowMainnet.id]: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  },
} as const satisfies Token;

export const ETH = {
  name: "ETH",
  icon: "/crypto-icons/ETH.png",
  decimals: 6,
  isNativeToken: false,
  chains: {
    [sepolia.id]: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    [hedera.id]: "0x000000000000000000000000000000000006f89a",
    [flowMainnet.id]: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  },
} as const satisfies Token;

