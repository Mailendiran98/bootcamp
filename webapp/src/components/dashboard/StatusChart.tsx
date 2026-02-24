"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { DashboardMetrics } from "@/types";

const COLORS = {
  Healthy: "#22c55e",
  Failed: "#ef4444",
  Delayed: "#eab308",
  "SLA Breach": "#f97316",
};

interface StatusChartProps {
  metrics: DashboardMetrics;
}

export default function StatusChart({ metrics }: StatusChartProps) {
  const data = [
    { name: "Healthy", value: metrics.healthy_pipelines },
    { name: "Failed", value: metrics.failed_pipelines },
    { name: "Delayed", value: metrics.delayed_pipelines },
    { name: "SLA Breach", value: metrics.sla_breached_pipelines },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="card">
        <h3 className="mb-4 text-sm font-medium text-gray-500">Pipeline Status Distribution</h3>
        <div className="flex h-48 items-center justify-center text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="mb-4 text-sm font-medium text-gray-500">Pipeline Status Distribution</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={COLORS[entry.name as keyof typeof COLORS]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
