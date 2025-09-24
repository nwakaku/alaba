"use client";

import { useEffect, useRef, useState } from "react";
import Image from "@/shims/image";
import { usePrivy } from "@privy-io/react-auth";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import InvestmentForm from "@/components/InvestmentForm";
import { Message, Token } from "@/types";
import StrategyMessage from "@/components/Messages/Strategy";
import Link from "@/shims/next-link";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const { ready: privyReady, authenticated, user } = usePrivy();

  const [messages, setMessages] = useState<Message[]>([]);
  const [hasSent, setHasSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Smoothly scroll to the bottom when messages update or loading changes
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  const loggedIn = privyReady && authenticated && user?.wallet?.address;

  const pieData = [
    {
      name: "Bonzo finance (Hedera)",
      value: 30,
      color: "#4A64DC",
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
      color: "#5FECF9",
      icon: "/crypto-icons/ETH.png",
      apy: 75.31,
      tvl: "$2.39B",
      risk: "Low",
      description:
        "Lend USDC on Aave Sepolia for high yield from borrowing demand and incentives; low protocol risk.",
    },
    {
      name: "stable Kitty",
      value: 20,
      color: "#9B8AFB",
      icon: "/crypto-icons/chains/747.svg",
      apy: 4.43,
      tvl: "$921,643.06",
      risk: "Medium",
      description:
        "Deposit WFLOW on StableKitty for modest returns from fees and emissions; medium protocol risk.",
    },
    {
      name: "Stader (Hedera)",
      value: 30,
      color: "#3B82F6",
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
                <div className="text-white/90">Stable Kitty</div>
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

  const handleSend = () => {
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

    // Send to backend and render AI response
    const url = `${import.meta.env.VITE_BACKEND_URL}/defiInfo`;
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input_text: text }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errText = await res.text().catch(() => "");
          throw new Error(errText || `Request failed with ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Expecting a string content; fallback to stringify
        const content = data.result;
        setMessages((prev: Message[]) => [
          ...prev,
          { role: "assistant", content },
        ]);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        setMessages((prev: Message[]) => [
          ...prev,
          {
            role: "assistant",
            content: `There was an error contacting the backend.\n${message}`,
          },
        ]);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="h-[calc(100vh-101px)] flex flex-col relative bg-background text-foreground">
      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Chat Area - Scrollable Content */}
        <div className="flex-1 max-h-[calc(100vh-101px-158px)] overflow-y-scroll">
          <div className="p-5 max-w-4xl mx-auto">
            <main className="space-y-20 pb-6">
              <section className="space-y-8">
                {!loggedIn ? (
                  <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6">
                    <h2 className="text-lg font-bold mb-3">
                      👋 Welcome to Alaba DeFi Bot
                    </h2>
                    <p className="text-sm opacity-90 leading-relaxed">
                      I&apos;m your DeFi investment copilot. You can build a
                      risk-diversified DeFi portfolio, or ask me anything about
                      DeFi investment.
                    </p>
                  </div>
                ) : (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-3">
                      <div className="max-w-[70%] bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-2xl px-4 py-3">
                        <p className="text-base opacity-90 leading-relaxed">
                          I&apos;m your DeFi investment copilot. You can build a
                          risk-diversified DeFi portfolio, or ask me anything
                          about DeFi investment.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Conversation Area */}
                {hasSent && (
                  <div className="space-y-6">
                    {messages.map((m, idx) => {
                      if (m.role === "user") {
                        return (
                          <div className="flex justify-end" key={idx}>
                            <div className="max-w-[70%] bg-white text-black rounded-lg px-4 py-3 shadow">
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
                            <div className="max-w-[70%] bg-foreground/5 rounded-2xl px-4 py-3">
                                <p className="text-base opacity-90 whitespace-pre-line">
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
                              <div className="max-w-[80%] bg-foreground/5 rounded-2xl px-4 py-3">
                                <div className="opacity-70 text-sm whitespace-pre-line">
                                  {m.content}
                                </div>
                              </div>
                            </div>

                            {/* Final Content */}

                            {/* Action buttons */}
                            <div className="flex gap-2 mt-3">
                              <Link href="/profile">
                                <button className="bg-[#5FECF9] flex items-center gap-2 text-black px-4 py-2 rounded-lg">
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
                            <div className="max-w-[80%] bg-foreground/5 rounded-2xl p-6">
                              <div className="opacity-90 text-sm whitespace-pre-line">
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
                  <div className="grid grid-cols-2 gap-5">
                    <div className="glass-card p-5 cursor-pointer hover:scale-[1.02] transition-transform group relative">
                      <div className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-3">
                        Step 1
                      </div>
                      <div className="text-base font-semibold leading-relaxed mb-5 text-white">
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

                    <div className="glass-card p-5 cursor-pointer hover:scale-[1.02] transition-transform group relative">
                      <div className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-3">
                        Step 2
                      </div>
                      <div className="text-base font-semibold leading-relaxed mb-5 text-white">
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
                      <div className="max-w-[70%] w-full">
                        <div className="grid grid-cols-2 gap-5">
                          <div
                            onClick={() => handleStrategyClick("multi")}
                            className="glass-card p-5 cursor-pointer hover:scale-[1.02] transition-transform group relative disabled:opacity-50"
                          >
                            <div className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-3">
                              MULTI STRATEGIES
                            </div>
                            <div className="text-base font-semibold leading-relaxed mb-5 text-white">
                              Create a Cross-Chain, Multi-Protocols Yield
                              Portfolio
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

                          <div
                            onClick={() => handleStrategyClick("single")}
                            className="glass-card p-5 cursor-pointer hover:scale-[1.02] transition-transform group relative disabled:opacity-50"
                          >
                            <div className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-3">
                              SINGLE STRATEGY
                            </div>
                            <div className="text-base font-semibold leading-relaxed mb-5 text-white">
                              Explore single DeFi Strategy
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
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-4xl mx-auto p-5">
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
              className={`rounded-lg p-4 flex items-center justify-between ${
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
                className="flex-1 bg-transparent outline-none text-black placeholder-gray-500 text-sm"
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
