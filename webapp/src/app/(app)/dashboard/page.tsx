"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { DashboardMetrics, Pipeline } from "@/types";
import MetricCard from "@/components/dashboard/MetricCard";
import PipelineTable from "@/components/dashboard/PipelineTable";
import StatusChart from "@/components/dashboard/StatusChart";
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [metricsRes, pipelinesRes] = await Promise.all([
          fetch("/api/dashboard/metrics"),
          fetch("/api/pipelines"),
        ]);
        if (metricsRes.ok) setMetrics(await metricsRes.json());
        if (pipelinesRes.ok) setPipelines(await pipelinesRes.json());
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  const m = metrics || {
    total_pipelines: 0,
    healthy_pipelines: 0,
    failed_pipelines: 0,
    delayed_pipelines: 0,
    sla_breached_pipelines: 0,
    sla_compliance_percentage: 0,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor your pipeline health at a glance
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <MetricCard
          title="Total Pipelines"
          value={m.total_pipelines}
          icon={Activity}
          color="bg-blue-100 text-blue-600"
        />
        <MetricCard
          title="Healthy"
          value={m.healthy_pipelines}
          icon={CheckCircle2}
          color="bg-green-100 text-green-600"
        />
        <MetricCard
          title="Failed"
          value={m.failed_pipelines}
          icon={XCircle}
          color="bg-red-100 text-red-600"
        />
        <MetricCard
          title="SLA Breach"
          value={m.sla_breached_pipelines}
          icon={AlertTriangle}
          color="bg-orange-100 text-orange-600"
        />
        <MetricCard
          title="Delayed"
          value={m.delayed_pipelines}
          icon={Clock}
          color="bg-yellow-100 text-yellow-600"
        />
        <MetricCard
          title="SLA Compliance"
          value={`${m.sla_compliance_percentage}%`}
          icon={TrendingUp}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Pipeline Overview
          </h2>
          <PipelineTable pipelines={pipelines} />
        </div>
        <div>
          <StatusChart metrics={m} />
        </div>
      </div>
    </div>
  );
}
