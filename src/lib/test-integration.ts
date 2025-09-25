// Simple integration test utilities
import { apiService } from "./api";
import { logger } from "./logger";

export async function testBackendConnection(): Promise<boolean> {
  try {
    console.log("Testing backend connection...");
    const response = await apiService.healthCheck();
    
    if (response.success) {
      console.log("✅ Backend connection successful:", response.data);
      logger.info("Backend connection test passed");
      return true;
    } else {
      console.error("❌ Backend connection failed:", response.error);
      logger.error("Backend connection test failed", new Error(response.error || "Unknown error"));
      return false;
    }
  } catch (error) {
    console.error("❌ Backend connection error:", error);
    logger.error("Backend connection test error", error instanceof Error ? error : new Error("Unknown error"));
    return false;
  }
}

export async function testSwapExecution(userId: string): Promise<boolean> {
  try {
    console.log("Testing swap execution...");
    const response = await apiService.executeSwap(userId);
    
    if (response.success) {
      console.log("✅ Swap execution successful:", response.data);
      logger.info("Swap execution test passed", { userId, result: response.data });
      return true;
    } else {
      console.error("❌ Swap execution failed:", response.error);
      logger.error("Swap execution test failed", new Error(response.error || "Unknown error"), { userId });
      return false;
    }
  } catch (error) {
    console.error("❌ Swap execution error:", error);
    logger.error("Swap execution test error", error instanceof Error ? error : new Error("Unknown error"), { userId });
    return false;
  }
}

export async function testBalanceOperations(userId: string): Promise<boolean> {
  try {
    console.log("Testing balance operations...");
    
    // Test setting a balance
    const setResponse = await apiService.setBalance(userId, "TEST", 100);
    if (!setResponse.success) {
      console.error("❌ Set balance failed:", setResponse.error);
      return false;
    }
    
    // Test getting the balance
    const getResponse = await apiService.getBalance(userId, "TEST");
    if (!getResponse.success || getResponse.data?.balance !== 100) {
      console.error("❌ Get balance failed:", getResponse.error);
      return false;
    }
    
    // Test incrementing the balance
    const incrementResponse = await apiService.incrementBalance(userId, "TEST", 50);
    if (!incrementResponse.success) {
      console.error("❌ Increment balance failed:", incrementResponse.error);
      return false;
    }
    
    // Test decrementing the balance
    const decrementResponse = await apiService.decrementBalance(userId, "TEST", 25);
    if (!decrementResponse.success) {
      console.error("❌ Decrement balance failed:", decrementResponse.error);
      return false;
    }
    
    // Verify final balance
    const finalResponse = await apiService.getBalance(userId, "TEST");
    if (!finalResponse.success || finalResponse.data?.balance !== 125) {
      console.error("❌ Final balance verification failed:", finalResponse.error);
      return false;
    }
    
    console.log("✅ Balance operations successful");
    logger.info("Balance operations test passed", { userId });
    return true;
  } catch (error) {
    console.error("❌ Balance operations error:", error);
    logger.error("Balance operations test error", error instanceof Error ? error : new Error("Unknown error"), { userId });
    return false;
  }
}

export async function runAllTests(userId?: string): Promise<{ success: boolean; results: Record<string, boolean> }> {
  const results: Record<string, boolean> = {};
  
  console.log("🧪 Running integration tests...");
  
  // Test backend connection
  results.backendConnection = await testBackendConnection();
  
  // Test balance operations (always run with a test user ID)
  const testUserId = userId || "test-user-123";
  results.balanceOperations = await testBalanceOperations(testUserId);
  
  // Test swap execution only if user ID provided
  if (userId) {
    results.swapExecution = await testSwapExecution(userId);
  } else {
    results.swapExecution = true; // Skip if no user ID
    console.log("⏭️ Skipping swap execution test (no user ID provided)");
  }
  
  const allPassed = Object.values(results).every(result => result === true);
  
  console.log("📊 Test Results:", results);
  console.log(allPassed ? "✅ All tests passed!" : "❌ Some tests failed");
  
  logger.info("Integration tests completed", { results, allPassed, userId });
  
  return { success: allPassed, results };
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testIntegration = {
    testBackendConnection,
    testSwapExecution,
    testBalanceOperations,
    runAllTests,
    logger,
  };
}
