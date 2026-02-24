"use client";

import Link from "next/link";
import { Pipeline } from "@/types";
import { formatDate, getStatusColor, getStatusDot, timeSince } from "@/lib/utils";

interface PipelineTableProps {
  pipelines: Pipeline[];
}

export default function PipelineTable({ pipelines }: PipelineTableProps) {
  if (pipelines.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">No pipelines registered yet.</p>
        <Link href="/pipelines" className="btn-primary mt-4 inline-block">
          Add Pipeline
        </Link>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden !p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th className="px-6 py-3 text-left font-medium text-gray-500">Pipeline</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Last Run</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Freshness</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">SLA</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pipelines.map((pipeline) => {
              const isFresh = pipeline.last_run_at
                ? (Date.now() - new Date(pipeline.last_run_at).getTime()) / 60000 <=
                pipeline.expected_cadence_minutes
                : false;

              return (
                <tr
                  key={pipeline.id}
                  className="transition-colors hover:bg-gray-50/50"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/pipelines/${pipeline.id}`}
                      className="font-medium text-gray-900 hover:text-brand-600"
                    >
                      {pipeline.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${getStatusDot(pipeline.current_status)}`} />
                      <span className="capitalize">{pipeline.current_status.replace("_", " ")}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {pipeline.last_run_at ? timeSince(pipeline.last_run_at) : "Never"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${isFresh
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-yellow-200 bg-yellow-50 text-yellow-700"
                        }`}
                    >
                      {isFresh ? "Fresh" : "Stale"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{pipeline.sla_minutes}m</td>
                  <td className="px-6 py-4 text-gray-400">{pipeline.source_id}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
