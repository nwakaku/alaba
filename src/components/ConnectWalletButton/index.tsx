"use client";

import { usePrivy, useLogin, useLogout } from "@privy-io/react-auth";
import { useDisconnect, useChainId } from "wagmi";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "@/shims/next-navigation";
import Image from "@/shims/image";

export default function ConnectWalletButton() {
  const [address, setAddress] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chainId = useChainId();
  const router = useRouter();

  const { ready: privyReady, authenticated, linkWallet, user } = usePrivy();

  const { login } = useLogin();

  const { logout } = useLogout({
    onSuccess: () => {
      if (
        localStorage.getItem("onboarding-dialog-shown") !== "never-show-again"
      )
        localStorage.setItem(`onboarding-dialog-shown`, "false");
    },
  });

  const { disconnect } = useDisconnect();

  // business logic
  const buttonReady = privyReady && !isLoading;
  const loggedIn = privyReady && authenticated && address;

  const handleDisconnect = async () => {
    try {
      setIsDropdownOpen(false);
      setIsLoading(true);
      await logout();
      disconnect();
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonOnClick = () => {
    if (!buttonReady) return;
    if (!loggedIn) {
      if (authenticated) {
        // User is authenticated but wallet not connected, use linkWallet instead
        linkWallet();
      } else {
        // User is not authenticated, use regular login
        login();
      }
      return;
    } else {
      handleDisconnect();
    }
  };

  useEffect(() => {
    console.log(user);
    if (!user?.wallet?.address) return;
    setAddress(user.wallet.address);
  }, [user]);

  return (
    <button
      onClick={handleButtonOnClick}
      className="flex items-center gap-2 px-6 py-2.5 bg-accent/20 border-2 border-accent/30 border-solid rounded-2xl hover:bg-accent/30 hover:border-accent/50 transition-all"
    >
      {buttonReady ? (
        loggedIn ? (
          <>
            <Image
              src={`/crypto-icons/chains/${chainId}.svg`}
              alt="chain"
              width={20}
              height={20}
            />
            <span className="font-semibold text-sm tracking-wide text-foreground">
              {user?.wallet?.address.slice(0, 6) +
                "..." +
                user?.wallet?.address.slice(-4)}
            </span>
          </>
        ) : (
          <span className="font-semibold text-sm tracking-wide uppercase text-foreground">
            Signup / Login
          </span>
        )
      ) : (
        <span className="font-semibold text-sm tracking-wide text-foreground">
          Loading...
        </span>
      )}
    </button>
  );
}
