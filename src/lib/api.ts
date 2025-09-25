// API service layer for backend communication
import { Token } from "@/types";
import { logger } from "./logger";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SwapResponse {
  message: string;
  output: string;
}

export interface BalanceResponse {
  user_id: string;
  token_symbol?: string;
  balance?: number;
  balances?: Record<string, number>;
}

export interface BalanceUpdateRequest {
  token_symbol: string;
  amount: number;
}

export interface DeFiInfoResponse {
  result: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    userId?: string
  ): Promise<ApiResponse<T>> {
    const startTime = Date.now();
    const method = options.method || 'GET';
    
    try {
      logger.apiRequest(endpoint, method, userId, options.body ? JSON.parse(options.body as string) : undefined);
      
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const responseTime = Date.now() - startTime;
      logger.apiResponse(endpoint, response.status, responseTime, userId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        const error = new Error(`HTTP ${response.status}: ${errorText}`);
        logger.apiError(endpoint, error, { status: response.status, responseTime }, userId);
        throw error;
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      logger.apiError(endpoint, error instanceof Error ? error : new Error(errorMessage), { responseTime }, userId);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Swap execution
  async executeSwap(userId?: string): Promise<ApiResponse<SwapResponse>> {
    if (userId) {
      logger.swapStarted(userId);
    }
    
    const result = await this.request<SwapResponse>("/api/execute-swap", {
      method: "POST",
    }, userId);

    if (result.success && userId) {
      logger.swapCompleted(userId, result.data);
    } else if (!result.success && userId) {
      logger.swapFailed(userId, new Error(result.error || "Unknown error"));
    }

    return result;
  }

  // DeFi information
  async getDeFiInfo(inputText: string, userId?: string): Promise<ApiResponse<DeFiInfoResponse>> {
    return this.request<DeFiInfoResponse>("/defiInfo", {
      method: "POST",
      body: JSON.stringify({ input_text: inputText }),
    }, userId);
  }

  // Balance management
  async getBalance(userId: string, tokenSymbol?: string): Promise<ApiResponse<BalanceResponse>> {
    const endpoint = tokenSymbol 
      ? `/balance/${userId}?token_symbol=${tokenSymbol}`
      : `/balance/${userId}`;
    return this.request<BalanceResponse>(endpoint, {}, userId);
  }

  async setBalance(
    userId: string, 
    tokenSymbol: string, 
    balance: number
  ): Promise<ApiResponse<BalanceResponse>> {
    const result = await this.request<BalanceResponse>(`/balance/${userId}/set`, {
      method: "POST",
      body: JSON.stringify({
        token_symbol: tokenSymbol,
        balance: balance,
      }),
    }, userId);

    if (result.success) {
      logger.balanceUpdated(userId, tokenSymbol, 0, balance);
    } else {
      logger.balanceError(userId, tokenSymbol, new Error(result.error || "Unknown error"));
    }

    return result;
  }

  async incrementBalance(
    userId: string,
    tokenSymbol: string,
    amount: number
  ): Promise<ApiResponse<BalanceResponse>> {
    const result = await this.request<BalanceResponse>(`/balance/${userId}/increment`, {
      method: "POST",
      body: JSON.stringify({
        token_symbol: tokenSymbol,
        amount: amount,
      }),
    }, userId);

    if (result.success && result.data) {
      logger.balanceUpdated(userId, tokenSymbol, result.data.previous_balance || 0, result.data.new_balance || 0);
    } else {
      logger.balanceError(userId, tokenSymbol, new Error(result.error || "Unknown error"));
    }

    return result;
  }

  async decrementBalance(
    userId: string,
    tokenSymbol: string,
    amount: number
  ): Promise<ApiResponse<BalanceResponse>> {
    const result = await this.request<BalanceResponse>(`/balance/${userId}/decrement`, {
      method: "POST",
      body: JSON.stringify({
        token_symbol: tokenSymbol,
        amount: amount,
      }),
    }, userId);

    if (result.success && result.data) {
      logger.balanceUpdated(userId, tokenSymbol, result.data.previous_balance || 0, result.data.new_balance || 0);
    } else {
      logger.balanceError(userId, tokenSymbol, new Error(result.error || "Unknown error"));
    }

    return result;
  }

  async getBalanceHistory(userId: string): Promise<ApiResponse<BalanceResponse>> {
    return this.request<BalanceResponse>(`/balance/${userId}/history`, {}, userId);
  }

  async clearBalances(userId: string, tokenSymbol?: string): Promise<ApiResponse<BalanceResponse>> {
    const endpoint = tokenSymbol 
      ? `/balance/${userId}?token_symbol=${tokenSymbol}`
      : `/balance/${userId}`;
    return this.request<BalanceResponse>(endpoint, {
      method: "DELETE",
    }, userId);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.request<{ status: string; message: string }>("/health");
  }
}

export const apiService = new ApiService();
