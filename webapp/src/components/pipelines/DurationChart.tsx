"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PipelineRun } from "@/types";

interface DurationChartProps {
  runs: PipelineRun[];
}

export default function DurationChart({ runs }: DurationChartProps) {
  const data = runs
    .slice(0, 7)
    .reverse()
    .map((run, i) => ({
      name: `Run ${i + 1}`,
      duration: run.duration_seconds ? Math.round(run.duration_seconds / 60) : 0,
      run_id: run.run_id,
    }));

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-gray-400">
        No run data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" fontSize={12} tick={{ fill: "#9ca3af" }} />
        <YAxis fontSize={12} tick={{ fill: "#9ca3af" }} unit="m" />
        <Tooltip
          formatter={(value: number) => [`${value} min`, "Duration"]}
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        />
        <Line
          type="monotone"
          dataKey="duration"
          stroke="#6366f1"
          strokeWidth={2}
          dot={{ fill: "#6366f1", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
