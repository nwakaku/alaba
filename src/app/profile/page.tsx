"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/shims/next-navigation";
import { usePrivy } from "@privy-io/react-auth";
import Image from "@/shims/image";
import CryptoIcon from "@/components/CryptoIcon";
import { DonutChart } from "@/components/DonutChart";
import { RefreshCw, ArrowDownToLine, ArrowUpFromLine, Eye, Loader2 } from "lucide-react";
import { useBalances } from "@/hooks/useBalances";
import SwapDepositButton from "@/components/SwapDepositButton";
import DebugPanel from "@/components/DebugPanel";

interface Asset {
  symbol: string;
  amount: string;
  value: string;
  chain: string;
  icon: string;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { user } = usePrivy();
  const { balanceState, refreshBalances } = useBalances();
  const [activeTab, setActiveTab] = useState("Assets");
  const [inputValue, setInputValue] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load balances when component mounts or user changes
  useEffect(() => {
    if (user?.wallet?.address) {
      refreshBalances(user.wallet.address);
    }
  }, [user?.wallet?.address, refreshBalances]);

  const handleRefresh = async () => {
    if (!user?.wallet?.address) return;
    setIsRefreshing(true);
    await refreshBalances(user.wallet.address);
    setIsRefreshing(false);
  };

  // Convert balance state to assets format
  const assets: Asset[] = Object.entries(balanceState.balances).map(([symbol, amount]) => {
    const iconMap: Record<string, string> = {
      "ETH": "/crypto-icons/ETH.png",
      "USDC": "/crypto-icons/USDC.png",
      "HBARX": "/crypto-icons/chains/296.svg",
      "USDF": "/crypto-icons/usdf.png",
      "HBAR": "/crypto-icons/chains/295.svg",
    };

    return {
      symbol,
      amount: amount.toFixed(4),
      value: amount.toFixed(2),
      chain: "Hedera", // Default to Hedera for now
      icon: iconMap[symbol] || "/crypto-icons/ETH.png",
    };
  });

  // Fallback to mock data if no balances
  const displayAssets = assets.length > 0 ? assets : [
    {
      symbol: "ETH",
      amount: "1.38",
      value: "4763",
      chain: "Sepolia",
      icon: "/crypto-icons/ETH.png",
    },
    {
      symbol: "USDC",
      amount: "5",
      value: "5",
      chain: "Hedera",
      icon: "/crypto-icons/USDC.png",
    },
    {
      symbol: "HBARX",
      amount: "2.99",
      value: "1.3",
      chain: "Hedera",
      icon: "/crypto-icons/chains/296.svg",
    },
    {
      symbol: "USDF",
      amount: "0.593",
      value: "0.593",
      chain: "Hedera",
      icon: "/crypto-icons/usdf.png",
    },
    {
      symbol: "HBAR",
      amount: "148.94",
      value: "37.83",
      chain: "Hedera",
      icon: "/crypto-icons/chains/295.svg",
    },
  ];

  const chartData = displayAssets.map((asset, index) => ({
    name: asset.symbol,
    percentage: Number(asset.value),
    color: `var(--chart-${(index % 5) + 1})`,
  }));

  return (
    <div className="bg-background text-foreground">
      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        <div className="flex justify-center">
          {/* Portfolio Panel */}
          <div className="flex-1">
            <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-4 sm:p-8 shadow-xl">
              <div>
                {/* Left Column and Chart Row */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-8 mt-4 sm:mt-8 mx-0 sm:ml-8 sm:mr-8">
                  {/* Left Column - Metrics and Actions */}
                  <div className="flex flex-col gap-6 sm:gap-8 w-full lg:w-[45%]">
                    {/* Three Financial Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                      <div>
                        <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                          Total Asset Value
                          <Eye size={14} className="text-muted-foreground" />
                        </div>
                        <div className="text-lg sm:text-xl font-bold text-foreground">$4821.45</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                          Total Position Value
                          <Eye size={14} className="text-muted-foreground" />
                        </div>
                        <div className="text-lg sm:text-xl font-bold text-foreground">$4801.45</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                          Total Profit
                          <Eye size={14} className="text-muted-foreground" />
                        </div>
                        <div className="text-lg sm:text-xl font-bold text-chart-2">
                          +$2.2
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleRefresh}
                        disabled={isRefreshing || balanceState.isLoading}
                        className="flex flex-col items-center gap-2 px-4 sm:px-6 py-3 bg-muted/50 border border-border/50 rounded-xl hover:bg-muted/70 hover:border-accent/50 transition-all cursor-pointer flex-1 disabled:opacity-50"
                      >
                        <div className="w-8 h-8 flex items-center justify-center">
                          {isRefreshing || balanceState.isLoading ? (
                            <Loader2 size={24} className="text-foreground animate-spin" />
                          ) : (
                            <RefreshCw size={24} className="text-foreground" />
                          )}
                        </div>
                        <div className="text-xs text-foreground/80 font-medium">
                          {isRefreshing || balanceState.isLoading ? "Refreshing..." : "Refresh"}
                        </div>
                      </button>
                      
                      <div className="flex-1">
                        <SwapDepositButton
                          onSuccess={(result) => {
                            console.log("Swap successful:", result);
                            // Refresh balances after successful swap
                            if (user?.wallet?.address) {
                              refreshBalances(user.wallet.address);
                            }
                          }}
                          onError={(error) => {
                            console.error("Swap error:", error);
                          }}
                          className="w-full h-full"
                        />
                      </div>

                      {[
                        { icon: ArrowDownToLine, label: "Deposit" },
                        { icon: ArrowUpFromLine, label: "Withdraw" },
                      ].map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                          <button
                            key={index}
                            className="flex flex-col items-center gap-2 px-4 sm:px-6 py-3 bg-muted/50 border border-border/50 rounded-xl hover:bg-muted/70 hover:border-accent/50 transition-all cursor-pointer flex-1"
                          >
                            <div className="w-8 h-8 flex items-center justify-center">
                              <IconComponent size={24} className="text-foreground" />
                            </div>
                            <div className="text-xs text-foreground/80 font-medium">
                              {stat.label}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Chart and Legend Container */}
                  <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12 w-full lg:w-[55%]">
                    {/* Donut Chart */}
                    <div className="flex-shrink-0 order-2 lg:order-1">
                      <DonutChart
                        data={chartData}
                        size={180}
                        strokeWidth={50}
                      />
                    </div>

                    {/* Asset Legend */}
                    <div className="bg-muted/30 backdrop-blur rounded-xl p-4 flex-1 order-1 lg:order-2 border border-border/30">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {chartData.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded flex-shrink-0"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-xs text-foreground/80 font-medium flex-1">
                              {item.name}
                            </span>
                            <span className="text-xs text-foreground/80 font-medium">
                              {item.percentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-6 px-4 sm:px-8">
                <div className="flex border-b border-border/50">
                  {["Assets", "Strategies", "Transactions"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 text-xs sm:text-sm font-semibold transition-colors relative flex-1 ${
                        activeTab === tab
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground/80"
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assets Table */}
              <div className="px-4 sm:px-8">
                {/* Table Headers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 pb-3 mb-4 border-b border-border/50">
                  <div className="text-xs text-muted-foreground font-medium">Coin</div>
                  <div className="text-xs text-muted-foreground font-medium hidden sm:block">Chain</div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Amount
                  </div>
                  <div className="text-xs text-muted-foreground font-medium hidden sm:block">
                    Action
                  </div>
                </div>

                {/* Table Rows */}
                <div className="space-y-4">
                  {displayAssets.map((asset, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 items-center py-3"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Image
                          src={asset.icon}
                          alt={asset.symbol}
                          width={36}
                          height={36}
                        />
                        <div className="text-xs sm:text-sm font-semibold text-foreground">
                          {asset.symbol}
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground/80 hidden sm:block">{asset.chain}</div>
                      <div className="text-left">
                        <div className="text-xs sm:text-sm text-foreground">{asset.amount}</div>
                        <div className="text-xs text-muted-foreground">
                          $ {asset.value}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-center">
                        <button className="py-2 bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg text-xs font-semibold transition-colors w-full sm:w-28 flex items-center justify-center">
                          Deposit
                        </button>
                        <button className="py-2 border border-border hover:bg-muted/50 rounded-lg text-xs font-semibold transition-colors w-full sm:w-28 flex items-center justify-center text-foreground">
                          Withdraw
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Panel - Only show in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8">
            <DebugPanel />
          </div>
        )}
      </div>
    </div>
  );
}
