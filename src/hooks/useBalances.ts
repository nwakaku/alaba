import { useState, useEffect, useCallback } from "react";
import { apiService, BalanceResponse } from "@/lib/api";

export interface BalanceState {
  balances: Record<string, number>;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface UseBalancesReturn {
  balanceState: BalanceState;
  refreshBalances: (userId: string) => Promise<void>;
  updateBalance: (userId: string, tokenSymbol: string, amount: number) => Promise<boolean>;
  incrementBalance: (userId: string, tokenSymbol: string, amount: number) => Promise<boolean>;
  decrementBalance: (userId: string, tokenSymbol: string, amount: number) => Promise<boolean>;
  clearError: () => void;
}

export function useBalances(): UseBalancesReturn {
  const [balanceState, setBalanceState] = useState<BalanceState>({
    balances: {},
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  const refreshBalances = useCallback(async (userId: string): Promise<void> => {
    setBalanceState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiService.getBalance(userId);
      
      if (response.success && response.data) {
        setBalanceState(prev => ({
          ...prev,
          balances: response.data!.balances || {},
          isLoading: false,
          lastUpdated: new Date(),
          error: null,
        }));
      } else {
        setBalanceState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || "Failed to fetch balances",
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setBalanceState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, []);

  const updateBalance = useCallback(async (
    userId: string, 
    tokenSymbol: string, 
    amount: number
  ): Promise<boolean> => {
    try {
      const response = await apiService.setBalance(userId, tokenSymbol, amount);
      
      if (response.success) {
        // Refresh balances after successful update
        await refreshBalances(userId);
        return true;
      } else {
        setBalanceState(prev => ({
          ...prev,
          error: response.error || "Failed to update balance",
        }));
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setBalanceState(prev => ({
        ...prev,
        error: errorMessage,
      }));
      return false;
    }
  }, [refreshBalances]);

  const incrementBalance = useCallback(async (
    userId: string, 
    tokenSymbol: string, 
    amount: number
  ): Promise<boolean> => {
    try {
      const response = await apiService.incrementBalance(userId, tokenSymbol, amount);
      
      if (response.success) {
        // Refresh balances after successful update
        await refreshBalances(userId);
        return true;
      } else {
        setBalanceState(prev => ({
          ...prev,
          error: response.error || "Failed to increment balance",
        }));
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setBalanceState(prev => ({
        ...prev,
        error: errorMessage,
      }));
      return false;
    }
  }, [refreshBalances]);

  const decrementBalance = useCallback(async (
    userId: string, 
    tokenSymbol: string, 
    amount: number
  ): Promise<boolean> => {
    try {
      const response = await apiService.decrementBalance(userId, tokenSymbol, amount);
      
      if (response.success) {
        // Refresh balances after successful update
        await refreshBalances(userId);
        return true;
      } else {
        setBalanceState(prev => ({
          ...prev,
          error: response.error || "Failed to decrement balance",
        }));
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setBalanceState(prev => ({
        ...prev,
        error: errorMessage,
      }));
      return false;
    }
  }, [refreshBalances]);

  const clearError = useCallback(() => {
    setBalanceState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    balanceState,
    refreshBalances,
    updateBalance,
    incrementBalance,
    decrementBalance,
    clearError,
  };
}
