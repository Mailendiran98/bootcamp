"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { PipelineRun } from "@/types";

interface RunStatusChartProps {
  runs: PipelineRun[];
}

export default function RunStatusChart({ runs }: RunStatusChartProps) {
  const statusCounts = runs.reduce(
    (acc, run) => {
      acc[run.status] = (acc[run.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const data = Object.entries(statusCounts).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count,
    key: status,
  }));

  const colorMap: Record<string, string> = {
    success: "#22c55e",
    failed: "#ef4444",
    running: "#3b82f6",
  };

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-gray-400">
        No run data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="status" fontSize={12} tick={{ fill: "#9ca3af" }} />
        <YAxis fontSize={12} tick={{ fill: "#9ca3af" }} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.key}
              fill={colorMap[entry.key] || "#9ca3af"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
