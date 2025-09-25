"use client";

import { useEffect, useRef, useState } from "react";
import Image from "@/shims/image";
import { usePrivy } from "@privy-io/react-auth";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import InvestmentForm from "@/components/InvestmentForm";
import SwapDepositButton from "@/components/SwapDepositButton";
import { Message, Token } from "@/types";
import StrategyMessage from "@/components/Messages/Strategy";
import Link from "@/shims/next-link";
import { apiService } from "@/lib/api";
import { useBalances } from "@/hooks/useBalances";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const { ready: privyReady, authenticated, user } = usePrivy();
  const { balanceState, refreshBalances } = useBalances();

  const [messages, setMessages] = useState<Message[]>([]);
  const [hasSent, setHasSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Smoothly scroll to the bottom when messages update or loading changes
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  // Load balances when user logs in
  useEffect(() => {
    if (user?.wallet?.address) {
      refreshBalances(user.wallet.address);
    }
  }, [user?.wallet?.address, refreshBalances]);

  const loggedIn = privyReady && authenticated && user?.wallet?.address;

  const pieData = [
    {
      name: "Bonzo finance (Hedera)",
      value: 30,
      color: "var(--accent)",
      icon: "/crypto-icons/chains/296.svg",
      apy: 0.37,
      tvl: "$407",
      risk: "Low",
      description:
        "Conservative HBARX yield with minimal volatility—very low APR and limited activity; capital preservation..",
    },
    {
      name: "AAVE Lending",
      value: 20,
      color: "var(--chart-2)",
      icon: "/crypto-icons/ETH.png",
      apy: 75.31,
      tvl: "$2.39B",
      risk: "Low",
      description:
        "Lend USDC on Aave Sepolia for high yield from borrowing demand and incentives; low protocol risk.",
    },
    {
      name: "Bonzo Finance",
      value: 20,
      color: "var(--chart-3)",
      icon: "/crypto-icons/chains/296.svg",
      apy: 4.43,
      tvl: "$921,643.06",
      risk: "Medium",
      description:
        "Deposit HBARX on Bonzo Finance for modest returns from fees and emissions; medium protocol risk.",
    },
    {
      name: "Stader (Hedera)",
      value: 30,
      color: "var(--chart-4)",
      icon: "/crypto-icons/chains/296.svg",
      apy: 12,
      tvl: "$108.38K",
      risk: "Medium",
      description:
        "Stake HBAR via Stader (HBARX) for steady staking rewards and liquidity; medium protocol/validator risk.",
    },
  ];

  const handleStrategyClick = (strategyType: "multi" | "single") => {
    if (!loggedIn || isLoading) return;

    const message =
      strategyType === "multi"
        ? "Help me create a cross-chain, multi-protocols yield portfolio"
        : "Help me explore single DeFi strategy";

    // Add user message and start loading
    setMessages((prev: Message[]) => [
      ...prev,
      { role: "user", content: message },
    ]);
    setHasSent(true);
    setInputValue("");
    setIsLoading(true);

    // Simulate loading and then add bot response
    setTimeout(() => {
      setMessages((prev: Message[]) => [
        ...prev,
        {
          role: "assistant",
          type: "input",
          content:
            "We will diversify your token into reputable and secured yield protocols based on your preference. \n What's your investment size (amount)?",
        },
      ]);
      setIsLoading(false);
    }, 2000);
  };

  const handleNewChat = () => {
    setMessages([]);
    setHasSent(false);
    setInputValue("");
    setIsLoading(false);
  };

  function handleUsdcSubmit(amount: string, currency: Token) {
    if (!amount) return;
    setMessages((prev: Message[]) => [
      ...prev,
      { role: "user", type: "input", content: `${amount} ${currency.name}` },
    ]);
    setIsLoading(true);
    setTimeout(() => {
      setMessages((prev: Message[]) => [
        ...prev,
        {
          role: "assistant",
          type: "strategy",
          content: `${amount} ${currency.name} it is! Here is the current recommended investment portfolio.`,
        },
      ]);
      setIsLoading(false);
    }, 2000);
  }

  function handleStrategySubmit(data: string, stage: string = "loading") {
    if (stage === "loading") {
      setIsLoading(true);
      setMessages((prev: Message[]) => [
        ...prev,
        { role: "user", type: "input", content: "Start Building Portfolio" },
      ]);
      return;
    }

    setMessages((prev: Message[]) => [
      ...prev,
      {
        role: "assistant",
        type: "end",
        content: (
          <>
            <div className="text-white font-semibold mb-2">
              Portfolio built successfully!
            </div>
            <div className="rounded-xl overflow-hidden divide-y divide-white/10">
              <div className="flex items-center justify-between p-3">
                <div className="text-white/90">Bonzo Finance</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-md bg-[#4A64DC]/20 text-[#4A64DC] font-medium">
                    30%
                  </span>
                  <span className="text-white/70 text-sm">21 USDC</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3">
                <div className="text-white/90">AAVE Lending</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-md bg-[#5FECF9]/20 text-[#5FECF9] font-medium">
                    20%
                  </span>
                  <span className="text-white/70 text-sm">14 USDC</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3">
                <div className="text-white/90">Bonzo Finance</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-md bg-[#9B8AFB]/20 text-[#9B8AFB] font-medium">
                    20%
                  </span>
                  <span className="text-white/70 text-sm">14 USDC</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3">
                <div className="text-white/90">Stader</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-md bg-[#3B82F6]/20 text-[#3B82F6] font-medium">
                    30%
                  </span>
                  <span className="text-white/70 text-sm">21 USDC</span>
                </div>
              </div>
            </div>
          </>
        ),
      },
    ]);

    setIsLoading(false);
  }

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || !loggedIn || isLoading) return;

    // Add user message and start loading
    setMessages((prev: Message[]) => [
      ...prev,
      { role: "user", content: text },
    ]);
    setHasSent(true);
    setInputValue("");
    setIsLoading(true);

    try {
      // Use the new API service with user ID
      const response = await apiService.getDeFiInfo(text, user?.wallet?.address);
      
      if (response.success && response.data?.result) {
        setMessages((prev: Message[]) => [
          ...prev,
          { role: "assistant", content: response.data.result },
        ]);
      } else {
        setMessages((prev: Message[]) => [
          ...prev,
          {
            role: "assistant",
            content: `I apologize, but I encountered an error: ${response.error || "Unknown error occurred"}. Please try again or rephrase your question.`,
          },
        ]);
      }
    } catch (error) {
      console.error("Error in handleSend:", error);
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      setMessages((prev: Message[]) => [
        ...prev,
        {
          role: "assistant",
          content: `I'm sorry, but I'm having trouble connecting to the backend right now. Error: ${message}. Please try again in a moment.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-101px)] h-[calc(100vh-101px)] flex flex-col relative bg-background text-foreground">
      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Chat Area - Scrollable Content */}
        <div className="flex-1 overflow-y-scroll">
          <div className="p-3 sm:p-5 max-w-6xl mx-auto">
            <main className="space-y-8 sm:space-y-20 pb-32">
              <section className="space-y-8">
                {!loggedIn ? (
                  <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6">
                    <h2 className="text-base sm:text-lg font-bold mb-3">
                      👋 Welcome to Alaba DeFi Bot
                    </h2>
                    <p className="text-xs sm:text-sm opacity-90 leading-relaxed">
                      I&apos;m your DeFi investment copilot. You can build a
                      risk-diversified DeFi portfolio, or ask me anything about
                      DeFi investment.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-start">
                      <div className="flex items-start gap-3">
                        <div className="max-w-[85%] sm:max-w-[70%] bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-2xl px-3 sm:px-4 py-3">
                          <p className="text-sm sm:text-base opacity-90 leading-relaxed">
                            I&apos;m your DeFi investment copilot. You can build a
                            risk-diversified DeFi portfolio, or ask me anything
                            about DeFi investment.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Balance Display */}
                    {balanceState.balances && Object.keys(balanceState.balances).length > 0 && (
                      <div className="flex justify-start">
                        <div className="max-w-[85%] sm:max-w-[70%] bg-gradient-to-r from-green-500/10 to-green-400/5 backdrop-blur-lg rounded-2xl px-3 sm:px-4 py-3 border border-green-500/20">
                          <div className="text-sm font-semibold text-green-400 mb-2">💰 Your Current Balances</div>
                          <div className="space-y-1">
                            {Object.entries(balanceState.balances).map(([token, balance]) => (
                              <div key={token} className="flex justify-between text-xs">
                                <span className="text-green-300">{token}:</span>
                                <span className="text-green-100">{balance.toFixed(4)}</span>
                              </div>
                            ))}
                          </div>
                          {balanceState.lastUpdated && (
                            <div className="text-xs text-green-300/70 mt-2">
                              Last updated: {balanceState.lastUpdated.toLocaleTimeString()}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {balanceState.error && (
                      <div className="flex justify-start">
                        <div className="max-w-[85%] sm:max-w-[70%] bg-gradient-to-r from-red-500/10 to-red-400/5 backdrop-blur-lg rounded-2xl px-3 sm:px-4 py-3 border border-red-500/20">
                          <div className="text-sm text-red-400">
                            ⚠️ Error loading balances: {balanceState.error}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Conversation Area */}
                {hasSent && (
                  <div className="space-y-6">
                    {messages.map((m, idx) => {
                      if (m.role === "user") {
                        return (
                          <div className="flex justify-end" key={idx}>
                            <div className="max-w-[85%] sm:max-w-[70%] bg-white text-black rounded-lg px-3 sm:px-4 py-3 shadow">
                              {m.content}
                            </div>
                          </div>
                        );
                      }
                      // assistant messages
                      if (m.type === "input") {
                        return (
                          <div
                            className="flex justify-start flex-col gap-4"
                            key={idx}
                          >
                            <div className="flex items-start gap-3">
                            <div className="max-w-[85%] sm:max-w-[70%] bg-foreground/5 rounded-2xl px-3 sm:px-4 py-3">
                                <p className="text-sm sm:text-base opacity-90 whitespace-pre-line">
                                  {m.content}
                                </p>
                              </div>
                            </div>
                            {/* Only render input control for the latest 'input' step */}
                            {idx === messages.length - 1 && (
                              <div className="flex items-center gap-2">
                                <div className={`w-full max-w-sm py-3`}>
                                  <div>
                                    <InvestmentForm
                                      onSubmit={handleUsdcSubmit}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }
                      if (m.type === "strategy") {
                        return (
                          <StrategyMessage
                            key={idx}
                            message={m}
                            pieData={pieData}
                            onSubmit={handleStrategySubmit}
                          />
                        );
                      }
                      if (m.type === "end") {
                        return (
                          <div
                            className="flex flex-col justify-start"
                            key={idx}
                          >
                            <div className="flex items-start gap-3">
                              <div className="max-w-[90%] sm:max-w-[80%] bg-foreground/5 rounded-2xl px-3 sm:px-4 py-3">
                                <div className="opacity-70 text-xs sm:text-sm whitespace-pre-line">
                                  {m.content}
                                </div>
                              </div>
                            </div>

                            {/* Final Content */}

                            {/* Action buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 mt-4">
                              <SwapDepositButton
                                onSuccess={(result) => {
                                  setSwapSuccess(true);
                                  console.log("Swap successful:", result);
                                }}
                                onError={(error) => {
                                  console.error("Swap error:", error);
                                }}
                                className="flex-1"
                              />
                              <Link href="/profile">
                                <button className="bg-[var(--accent)] flex items-center gap-2 text-[var(--accent-foreground)] px-4 py-2 rounded-lg hover:bg-[var(--accent)]/90 transition-colors">
                                  <ArrowUpRight size={15} />
                                  View Profile
                                </button>
                              </Link>
                            </div>
                          </div>
                        );
                      }
                      // default assistant text
                      return (
                        <div className="flex justify-start" key={idx}>
                          <div className="flex items-start gap-3">
                            <div className="max-w-[90%] sm:max-w-[80%] bg-foreground/5 rounded-2xl p-4 sm:p-6">
                              <div className="opacity-90 text-xs sm:text-sm whitespace-pre-line">
                                {m.content}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Loading message */}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex items-start gap-3">
                          <div className="bg-foreground/5 rounded-2xl px-4 py-3">
                            <div className="flex items-center opacity-90">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                                <div
                                  className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                  className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Login Steps - Only show when not logged in and not in conversation */}
                {!hasSent && !loggedIn && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="glass-card p-4 sm:p-5 cursor-pointer hover:scale-[1.02] transition-transform group relative">
                      <div className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-2 sm:mb-3">
                        Step 1
                      </div>
                      <div className="text-sm sm:text-base font-semibold leading-relaxed mb-4 sm:mb-5 text-white">
                        Create an account, or login existing account
                      </div>
                      <div className="absolute bottom-5 right-5">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="opacity-80 group-hover:opacity-100 transition-opacity"
                        >
                          <path
                            d="M7 17L17 7M17 7H7M17 7V17"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="glass-card p-4 sm:p-5 cursor-pointer hover:scale-[1.02] transition-transform group relative">
                      <div className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-2 sm:mb-3">
                        Step 2
                      </div>
                      <div className="text-sm sm:text-base font-semibold leading-relaxed mb-4 sm:mb-5 text-white">
                        Create a Cross-Chain, Multi-Protocols Yield Portfolio
                      </div>
                      <div className="absolute bottom-5 right-5">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="opacity-80 group-hover:opacity-100 transition-opacity"
                        >
                          <path
                            d="M7 17L17 7M17 7H7M17 7V17"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* Strategy Selection - Only show when not in conversation and logged in */}
                {!hasSent && loggedIn && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-3">
                      <div className="max-w-[85%] sm:max-w-[70%] w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          {/* Multi-Strategies Card */}
                          <div
                            onClick={() => handleStrategyClick("multi")}
                            className="group relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-6 cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-accent/10 transition-all duration-300 disabled:opacity-50 overflow-hidden"
                          >
                            {/* Background gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-chart-2/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            {/* Content */}
                            <div className="relative z-10">
                              <div className="flex items-center justify-between mb-4">
                                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                  MULTI STRATEGIES
                                </div>
                                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="text-accent"
                                  >
                                    <path
                                      d="M12 2L2 7L12 12L22 7L12 2Z"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M2 17L12 22L22 17"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M2 12L12 17L22 12"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </div>
                              </div>
                              
                              <div className="text-lg sm:text-xl font-bold text-foreground leading-tight mb-6">
                                Create a Cross-Chain, Multi-Protocols Yield Portfolio
                              </div>
                              
                              <div className="text-sm text-muted-foreground leading-relaxed mb-6">
                                Diversify across multiple chains and protocols for optimal risk-adjusted returns
                              </div>
                              
                             
                            </div>
                            
                            {/* Arrow icon */}
                            <div className="absolute bottom-6 right-6 opacity-60 group-hover:opacity-100 transition-opacity">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="text-foreground"
                              >
                                <path
                                  d="M7 17L17 7M17 7H7M17 7V17"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          </div>

                          {/* Single Strategy Card */}
                          <div
                            onClick={() => handleStrategyClick("single")}
                            className="group relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-6 cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-chart-2/10 transition-all duration-300 disabled:opacity-50 overflow-hidden"
                          >
                            {/* Background gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-chart-2/5 via-transparent to-chart-3/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            {/* Content */}
                            <div className="relative z-10">
                              <div className="flex items-center justify-between mb-4">
                                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                  SINGLE STRATEGY
                                </div>
                                <div className="w-8 h-8 rounded-full bg-chart-2/20 flex items-center justify-center">
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="text-chart-2"
                                  >
                                    <path
                                      d="M9 12L11 14L15 10"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </div>
                              </div>
                              
                              <div className="text-lg sm:text-xl font-bold text-foreground leading-tight mb-6">
                                Explore Single DeFi Strategy
                              </div>
                              
                              <div className="text-sm text-muted-foreground leading-relaxed mb-6">
                                Focus on one protocol or strategy for concentrated exposure and learning
                              </div>
                              
                              
                            </div>
                            
                            {/* Arrow icon */}
                            <div className="absolute bottom-6 right-6 opacity-60 group-hover:opacity-100 transition-opacity">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="text-foreground"
                              >
                                <path
                                  d="M7 17L17 7M17 7H7M17 7V17"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </main>
            {/* Auto-scroll anchor */}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Fixed Chat Section at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-background">
          <div className="max-w-4xl mx-auto p-3 sm:p-5">
            {/* New Chat button - above input container when conversation exists */}
            {hasSent && (
              <div className="flex justify-center mb-4">
                <button
                  onClick={handleNewChat}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm hover:bg-white/15 transition-colors text-white flex items-center gap-2"
                >
                  <RotateCcw size={15} />
                  New Chat
                </button>
              </div>
            )}

            <div
              className={`rounded-lg p-3 sm:p-4 flex items-center justify-between ${
                loggedIn ? "bg-white" : "bg-gray-300"
              }`}
            >
              <input
                type="text"
                value={inputValue}
                disabled={!loggedIn || isLoading}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (loggedIn && !isLoading && inputValue.trim()) {
                      handleSend();
                    }
                  }
                }}
                placeholder={
                  isLoading
                    ? "Loading..."
                    : "Ask me anything about DeFi investment"
                }
                className="flex-1 bg-transparent outline-none text-black placeholder-gray-500 text-xs sm:text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!loggedIn || isLoading}
                className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50"
              >
                <Image
                  src="/icons/send.svg"
                  alt="Send"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
