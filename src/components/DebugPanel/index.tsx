import React, { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { runAllTests } from "@/lib/test-integration";
import { logger } from "@/lib/logger";
import { Bug, Play, Download, Trash2 } from "lucide-react";

interface DebugPanelProps {
  className?: string;
}

export default function DebugPanel({ className = "" }: DebugPanelProps) {
  const { user } = usePrivy();
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, boolean> | null>(null);
  const [logs, setLogs] = useState<string>("");

  const handleRunTests = async () => {
    setIsRunning(true);
    setTestResults(null);
    
    try {
      const results = await runAllTests(user?.wallet?.address);
      setTestResults(results.results);
    } catch (error) {
      console.error("Test execution error:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleExportLogs = () => {
    const logData = logger.exportLogs();
    const blob = new Blob([logData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `alaba-debug-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = () => {
    logger.clearLogs();
    setLogs("");
  };

  const handleViewLogs = () => {
    const logData = logger.exportLogs();
    setLogs(logData);
  };

  return (
    <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Bug className="w-5 h-5" />
        <h3 className="font-semibold">Debug Panel</h3>
      </div>

      <div className="space-y-4">
        {/* Test Controls */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={handleRunTests}
              disabled={isRunning}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
            >
              <Play className="w-4 h-4" />
              {isRunning ? "Running..." : "Run Tests"}
            </button>
            
            <button
              onClick={handleViewLogs}
              className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
            >
              <Bug className="w-4 h-4" />
              View Logs
            </button>
            
            <button
              onClick={handleExportLogs}
              className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
            >
              <Download className="w-4 h-4" />
              Export Logs
            </button>
            
            <button
              onClick={handleClearLogs}
              className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Clear Logs
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResults && (
          <div className="space-y-2">
            <h4 className="font-medium">Test Results:</h4>
            <div className="space-y-1">
              {Object.entries(testResults).map(([test, passed]) => (
                <div key={test} className="flex items-center gap-2 text-sm">
                  <span className={`w-2 h-2 rounded-full ${passed ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="capitalize">{test.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <span className={passed ? 'text-green-600' : 'text-red-600'}>
                    {passed ? 'PASS' : 'FAIL'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logs Display */}
        {logs && (
          <div className="space-y-2">
            <h4 className="font-medium">Recent Logs:</h4>
            <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-auto max-h-64">
              {logs}
            </pre>
          </div>
        )}

        {/* User Info */}
        <div className="text-xs text-gray-600 dark:text-gray-400">
          <div>User: {user?.wallet?.address || "Not connected"}</div>
          <div>Backend: {import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"}</div>
        </div>
      </div>
    </div>
  );
}
