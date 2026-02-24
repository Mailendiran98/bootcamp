"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface CreatePipelineModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export default function CreatePipelineModal({
  onClose,
  onCreated,
}: CreatePipelineModalProps) {
  const [form, setForm] = useState({
    name: "",
    source_id: "",
    sla_minutes: 30,
    expected_cadence_minutes: 60,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/pipelines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create pipeline");
      }

      onCreated();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Register Pipeline for Monitoring
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Pipeline Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
              placeholder="e.g., sales_etl"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Databricks Job ID / Name
            </label>
            <input
              type="text"
              value={form.source_id}
              onChange={(e) => setForm({ ...form, source_id: e.target.value })}
              className="input-field"
              placeholder="e.g., dbx_job_12345"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                SLA (minutes)
              </label>
              <input
                type="number"
                min={1}
                value={form.sla_minutes}
                onChange={(e) =>
                  setForm({ ...form, sla_minutes: parseInt(e.target.value) || 0 })
                }
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Expected Cadence (minutes)
              </label>
              <input
                type="number"
                min={1}
                value={form.expected_cadence_minutes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    expected_cadence_minutes: parseInt(e.target.value) || 0,
                  })
                }
                className="input-field"
                required
              />
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Source type is set to Databricks. This registers a pipeline for monitoring only — it does not create a real pipeline.
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Creating..." : "Register Pipeline"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
