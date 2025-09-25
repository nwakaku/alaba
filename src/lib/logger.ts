// Comprehensive error logging utility
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
  userId?: string;
  action?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory

  private addLog(level: LogLevel, message: string, context?: Record<string, any>, error?: Error, userId?: string, action?: string) {
    const logEntry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
      error,
      userId,
      action,
    };

    this.logs.push(logEntry);
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console logging based on level
    const logMessage = `[${level.toUpperCase()}] ${message}`;
    const logData = { context, error, userId, action };

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, logData);
        break;
      case LogLevel.INFO:
        console.info(logMessage, logData);
        break;
      case LogLevel.WARN:
        console.warn(logMessage, logData);
        break;
      case LogLevel.ERROR:
        console.error(logMessage, logData);
        break;
    }
  }

  debug(message: string, context?: Record<string, any>, userId?: string, action?: string) {
    this.addLog(LogLevel.DEBUG, message, context, undefined, userId, action);
  }

  info(message: string, context?: Record<string, any>, userId?: string, action?: string) {
    this.addLog(LogLevel.INFO, message, context, undefined, userId, action);
  }

  warn(message: string, context?: Record<string, any>, userId?: string, action?: string) {
    this.addLog(LogLevel.WARN, message, context, undefined, userId, action);
  }

  error(message: string, error?: Error, context?: Record<string, any>, userId?: string, action?: string) {
    this.addLog(LogLevel.ERROR, message, context, error, userId, action);
  }

  // API-specific logging methods
  apiRequest(endpoint: string, method: string, userId?: string, payload?: any) {
    this.info(`API Request: ${method} ${endpoint}`, { payload }, userId, 'api_request');
  }

  apiResponse(endpoint: string, status: number, responseTime: number, userId?: string) {
    this.info(`API Response: ${endpoint}`, { status, responseTime }, userId, 'api_response');
  }

  apiError(endpoint: string, error: Error, userId?: string, context?: Record<string, any>) {
    this.error(`API Error: ${endpoint}`, error, context, userId, 'api_error');
  }

  // Swap-specific logging
  swapStarted(userId: string, context?: Record<string, any>) {
    this.info('Swap execution started', context, userId, 'swap_started');
  }

  swapCompleted(userId: string, result: any) {
    this.info('Swap execution completed', { result }, userId, 'swap_completed');
  }

  swapFailed(userId: string, error: Error, context?: Record<string, any>) {
    this.error('Swap execution failed', error, context, userId, 'swap_failed');
  }

  // Balance-specific logging
  balanceUpdated(userId: string, tokenSymbol: string, oldBalance: number, newBalance: number) {
    this.info('Balance updated', { 
      tokenSymbol, 
      oldBalance, 
      newBalance, 
      change: newBalance - oldBalance 
    }, userId, 'balance_updated');
  }

  balanceError(userId: string, tokenSymbol: string, error: Error, context?: Record<string, any>) {
    this.error('Balance operation failed', error, { tokenSymbol, ...context }, userId, 'balance_error');
  }

  // UI-specific logging
  userAction(action: string, userId?: string, context?: Record<string, any>) {
    this.info(`User action: ${action}`, context, userId, 'user_action');
  }

  // Get logs for debugging
  getLogs(level?: LogLevel, userId?: string, action?: string): LogEntry[] {
    return this.logs.filter(log => {
      if (level && log.level !== level) return false;
      if (userId && log.userId !== userId) return false;
      if (action && log.action !== action) return false;
      return true;
    });
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }

  // Export logs for debugging
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();
