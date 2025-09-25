import React from "react";
import { useSwap } from "@/hooks/useSwap";
import { useBalances } from "@/hooks/useBalances";
import { usePrivy } from "@privy-io/react-auth";
import { ArrowRightLeft, Loader2, CheckCircle, XCircle } from "lucide-react";

interface SwapDepositButtonProps {
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
}

export default function SwapDepositButton({
  onSuccess,
  onError,
  className = "",
  disabled = false,
}: SwapDepositButtonProps) {
  const { user } = usePrivy();
  const { swapState, executeSwap, clearError } = useSwap();
  const { refreshBalances } = useBalances();

  const handleSwapDeposit = async () => {
    if (!user?.wallet?.address) {
      onError?.("Please connect your wallet first");
      return;
    }

    clearError();
    const success = await executeSwap(user.wallet.address);

    if (success) {
      // Refresh balances after successful swap
      await refreshBalances(user.wallet.address);
      onSuccess?.(swapState.lastResult);
    } else {
      onError?.(swapState.error || "Swap failed");
    }
  };

  const getButtonContent = () => {
    if (swapState.isExecuting) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Executing Swap...</span>
        </>
      );
    }

    if (swapState.lastResult) {
      return (
        <>
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Swap Complete</span>
        </>
      );
    }

    return (
      <>
        <ArrowRightLeft className="w-4 h-4" />
        <span>Swap & Deposit</span>
      </>
    );
  };

  const isDisabled = disabled || swapState.isExecuting || !user?.wallet?.address;

  return (
    <div className="space-y-2">
      <button
        onClick={handleSwapDeposit}
        disabled={isDisabled}
        className={`
          flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm
          transition-all duration-200 min-w-[140px]
          ${
            isDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : swapState.lastResult
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-lg"
          }
          ${className}
        `}
      >
        {getButtonContent()}
      </button>

      {swapState.error && (
        <div className="flex items-center gap-2 text-red-600 text-xs">
          <XCircle className="w-4 h-4" />
          <span>{swapState.error}</span>
        </div>
      )}

      {swapState.lastResult && (
        <div className={`text-xs p-2 rounded border ${
          swapState.lastResult.error 
            ? "text-red-600 bg-red-50 border-red-200" 
            : "text-green-600 bg-green-50 border-green-200"
        }`}>
          <div className="font-semibold mb-1">
            {swapState.lastResult.error ? "Configuration Required" : "Swap Successful!"}
          </div>
          <div className="text-gray-600">
            {swapState.lastResult.error || swapState.lastResult.message}
          </div>
          {swapState.lastResult.error && (
            <div className="mt-2 text-xs text-gray-500">
              Please contact the administrator to configure the swap functionality.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
