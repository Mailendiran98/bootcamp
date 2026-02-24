"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pipeline } from "@/types";
import { getStatusDot, timeSince } from "@/lib/utils";
import { Plus, Search } from "lucide-react";
import CreatePipelineModal from "@/components/pipelines/CreatePipelineModal";

export default function PipelinesPage() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const fetchPipelines = async () => {
    try {
      const res = await fetch("/api/pipelines");
      if (res.ok) setPipelines(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipelines();
  }, []);

  const filtered = pipelines.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pipelines</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your monitored pipelines
          </p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Pipeline
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pipelines..."
            className="input-field pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card py-12 text-center">
          <p className="text-gray-500">
            {search ? "No pipelines match your search." : "No pipelines registered yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pipeline) => (
            <Link
              key={pipeline.id}
              href={`/pipelines/${pipeline.id}`}
              className="card transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{pipeline.name}</h3>
                  <p className="mt-1 text-xs text-gray-400">{pipeline.source_id}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm">
                  <span className={`h-2 w-2 rounded-full ${getStatusDot(pipeline.current_status)}`} />
                  <span className="capitalize text-gray-600">
                    {pipeline.current_status.replace("_", " ")}
                  </span>
                </span>
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                <span>SLA: {pipeline.sla_minutes}m</span>
                <span>Cadence: {pipeline.expected_cadence_minutes}m</span>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Last run: {pipeline.last_run_at ? timeSince(pipeline.last_run_at) : "Never"}
              </p>
            </Link>
          ))}
        </div>
      )}

      {showCreate && (
        <CreatePipelineModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            fetchPipelines();
          }}
        />
      )}
    </div>
  );
}
