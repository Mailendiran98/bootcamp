"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Pipeline, PipelineRun } from "@/types";
import { formatDuration, getStatusColor, timeSince } from "@/lib/utils";
import { ArrowLeft, Clock, Activity, Database, AlertTriangle } from "lucide-react";
import DurationChart from "@/components/pipelines/DurationChart";
import RunStatusChart from "@/components/pipelines/RunStatusChart";

export default function PipelineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [pipeline, setPipeline] = useState<Pipeline | null>(null);
  const [runs, setRuns] = useState<PipelineRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [pipelineRes, runsRes] = await Promise.all([
          fetch(`/api/pipelines/${id}`),
          fetch(`/api/pipelines/${id}/runs`),
        ]);
        
        if (pipelineRes.ok) setPipeline(await pipelineRes.json());
        if (runsRes.ok) setRuns(await runsRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (!pipeline) {
    return (
      <div className="card py-12 text-center">
        <h2 className="text-lg font-semibold text-gray-900">Pipeline not found</h2>
        <p className="mt-2 text-gray-500">The pipeline you are looking for does not exist or you do not have access.</p>
        <button onClick={() => router.push("/pipelines")} className="btn-primary mt-6">
          Back to Pipelines
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/pipelines"
          className="mb-4 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to Pipelines
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pipeline.name}</h1>
            <p className="mt-1 flex items-center text-sm text-gray-500">
              <Database className="mr-1.5 h-4 w-4" />
              Databricks Job: <span className="ml-1 font-mono">{pipeline.source_id}</span>
            </p>
          </div>
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getStatusColor(pipeline.current_status)}`}>
            <span className="capitalize">{pipeline.current_status.replace("_", " ")}</span>
          </span>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5">
          <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
            <Clock className="h-4 w-4" />
            Last Run
          </div>
          <p className="mt-2 text-xl font-semibold text-gray-900">
            {pipeline.last_run_at ? timeSince(pipeline.last_run_at) : "Never"}
          </p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
            <Activity className="h-4 w-4" />
            Expected Cadence
          </div>
          <p className="mt-2 text-xl font-semibold text-gray-900">{pipeline.expected_cadence_minutes}m</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
            <AlertTriangle className="h-4 w-4" />
            SLA Target
          </div>
          <p className="mt-2 text-xl font-semibold text-gray-900">{pipeline.sla_minutes}m</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
            <Database className="h-4 w-4" />
            Total Runs
          </div>
          <p className="mt-2 text-xl font-semibold text-gray-900">{runs.length}</p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Duration Trend (Last 7 Runs)</h2>
          <DurationChart runs={runs} />
        </div>
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Status Distribution</h2>
          <RunStatusChart runs={runs} />
        </div>
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Run History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="px-6 py-3 text-left font-medium text-gray-500">Run ID</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Duration</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Rows</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {runs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No run history available yet.
                  </td>
                </tr>
              ) : (
                runs.map((run) => (
                  <tr key={run.id} className="transition-colors hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{run.run_id}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${getStatusColor(run.status)}`}>
                        {run.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{formatDuration(run.duration_seconds)}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {run.rows_processed !== null ? run.rows_processed.toLocaleString() : "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(run.start_time).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
