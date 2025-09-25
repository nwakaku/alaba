import { useState, useCallback } from "react";
import { apiService, SwapResponse } from "@/lib/api";
import { logger } from "@/lib/logger";

export interface SwapState {
  isExecuting: boolean;
  error: string | null;
  lastResult: SwapResponse | null;
}

export interface UseSwapReturn {
  swapState: SwapState;
  executeSwap: (userId?: string) => Promise<boolean>;
  clearError: () => void;
  clearResult: () => void;
}

export function useSwap(): UseSwapReturn {
  const [swapState, setSwapState] = useState<SwapState>({
    isExecuting: false,
    error: null,
    lastResult: null,
  });

  const executeSwap = useCallback(async (userId?: string): Promise<boolean> => {
    setSwapState(prev => ({ ...prev, isExecuting: true, error: null }));
    logger.userAction("swap_execution_started", userId);

    try {
      const response = await apiService.executeSwap(userId);
      
      if (response.success && response.data) {
        setSwapState(prev => ({
          ...prev,
          isExecuting: false,
          lastResult: response.data!,
          error: null,
        }));
        logger.userAction("swap_execution_completed", userId, { result: response.data });
        return true;
      } else {
        setSwapState(prev => ({
          ...prev,
          isExecuting: false,
          error: response.error || "Swap execution failed",
        }));
        logger.userAction("swap_execution_failed", userId, { error: response.error });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setSwapState(prev => ({
        ...prev,
        isExecuting: false,
        error: errorMessage,
      }));
      logger.userAction("swap_execution_error", userId, { error: errorMessage });
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    setSwapState(prev => ({ ...prev, error: null }));
  }, []);

  const clearResult = useCallback(() => {
    setSwapState(prev => ({ ...prev, lastResult: null }));
  }, []);

  return {
    swapState,
    executeSwap,
    clearError,
    clearResult,
  };
}
