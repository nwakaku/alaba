import Image from "@/shims/image";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Percent, ArrowUpRight, AlertCircle } from "lucide-react";
import { Message, StrategyPieChartData } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { apiService } from "@/lib/api";
import { usePrivy } from "@privy-io/react-auth";

export default function StrategyMessage({
  message,
  pieData,
  onSubmit,
}: {
  message: Message;
  pieData: StrategyPieChartData[];
  onSubmit: (data: string, stage: string) => void;
}) {
  const { user } = usePrivy();
  const [isDisabled, setIsDisabled] = useState(false);
  const [editing, setEditing] = useState(false);
  const [data, setData] = useState(pieData);
  const [draft, setDraft] = useState(pieData);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<string | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);

  const total = draft.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  const isExact = total === 100;
  const exceeds = total > 100;
  const remaining = 100 - total;

  const updateDraft = (index: number, nextVal: number) => {
    setDraft((prev) =>
      prev.map((item, i) => (i === index ? { ...item, value: nextVal } : item))
    );
  };

  const handleBuildPortfolio = async () => {
    onSubmit("", "loading");
    setIsDisabled(true);
    setIsExecuting(true);
    setExecutionError(null);
    setExecutionResult(null);

    try {
      const response = await apiService.executeSwap(user?.wallet?.address);

      if (!response.success) {
        throw new Error(response.error || "Failed to execute swap script");
      }

      setExecutionResult(response.data?.message + "\n" + response.data?.output);
      onSubmit("", "end");
      setIsDisabled(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setExecutionError(message);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex flex-col justify-start">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
          <Image
            src="/crypto-icons/chains/296.svg"
            alt="Bot"
            width={32}
            height={32}
          />
        </div>
        <div className="max-w-[80%] bg-foreground/5 rounded-2xl px-4 py-3">
          <p className="mb-3 text-base opacity-90">{message.content}</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="mt-2 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="w-32 h-32 sm:w-44 sm:h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={35}
                outerRadius={55}
                stroke="none"
              >
                {data.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        {!editing ? (
          <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm opacity-90">
            {data.map((d) => (
              <li key={d.name} className="flex items-center gap-1 sm:gap-2">
                <span
                  className="inline-block w-3 h-3 rounded-sm"
                  style={{ backgroundColor: d.color }}
                />
                <span className="font-medium text-xs sm:text-sm">{d.name}</span>
                <span className="opacity-60 text-xs sm:text-sm">{d.value}%</span>
                <span>
                  <Image src={d.icon} alt={d.name} width={16} height={16} className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
                <Tooltip>
                  <TooltipTrigger>
                    <AlertCircle size={12} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="rounded-md bg-white text-black py-2 px-3 shadow-lg">
                      <div className="text-xs space-y-1">
                        <div>
                          <span className="font-medium">APY:</span> {d.apy}%
                        </div>
                        {d.tvl && (
                          <div>
                            <span className="font-medium">TVL:</span> {d.tvl}
                          </div>
                        )}
                        {d.risk && (
                          <div>
                            <span className="font-medium">Risk:</span> {d.risk}
                          </div>
                        )}
                        <div className="text-black/80">{d.description}</div>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </li>
            ))}
          </ul>
        ) : (
          <div className="space-y-3">
            {draft.map((d, i) => (
              <div key={d.name} className="flex items-center gap-3 text-sm">
                <span
                  className="inline-block w-3 h-3 rounded-sm"
                  style={{ backgroundColor: d.color }}
                />
                <span className="font-medium">{d.name}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={d.value}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    updateDraft(
                      i,
                      isNaN(v) ? 0 : Math.max(0, Math.min(100, v))
                    );
                  }}
                  className="w-20 rounded-md bg-muted border border-border px-2 py-1 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <span className="text-muted-foreground">%</span>
              </div>
            ))}
            <div className="text-xs">
              <span
                className={
                  exceeds
                    ? "text-destructive"
                    : isExact
                    ? "text-green-500"
                    : "text-muted-foreground"
                }
              >
                Total: {total}%
              </span>
              {total < 100 && (
                <span className="ml-2 text-muted-foreground/70">
                  Remaining: {Math.max(0, remaining)}%
                </span>
              )}
              {exceeds && (
                <span className="ml-2 text-destructive">
                  Total cannot exceed 100%
                </span>
              )}
              {!isExact && !exceeds && (
                <span className="ml-2 text-muted-foreground">
                  Total must equal 100% to confirm
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {!editing ? (
        <div className="flex gap-2">
          <button
            className="border border-[var(--accent)] rounded-lg flex items-center gap-2 bg-transparent text-[var(--accent)] px-4 py-2"
            onClick={() => {
              setDraft(data);
              setEditing(true);
            }}
            disabled={isDisabled}
          >
            <Percent size={15} color="#5FECF9" />
            Change Percentage
          </button>
          <button
            className="bg-[var(--accent)] flex items-center gap-2 text-[var(--accent-foreground)] px-4 py-2 rounded-lg"
            onClick={handleBuildPortfolio}
            disabled={isDisabled}
          >
            <ArrowUpRight size={15} />
            Start Building Portfolio
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            className="border border-white/20 text-white px-4 py-2 rounded-lg"
            onClick={() => {
              setDraft(data);
              setEditing(false);
            }}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              isExact
                ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                : "bg-[var(--accent)]/40 text-black/60 cursor-not-allowed"
            }`}
            disabled={!isExact}
            onClick={() => {
              setData(draft);
              setEditing(false);
            }}
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
}
