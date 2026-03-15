"use client";

import { useEffect, useState } from "react";
import { Project } from "@/types";
import { Key, Copy, CheckCircle2, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          // Assuming single project per user for MVP
          if (data && data.length > 0) {
            setProject(data[0]);
          } else {
            // Create a default project if none exists
            const createRes = await fetch("/api/projects", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: "Default Workspace" }),
            });
            if (createRes.ok) {
              setProject(await createRes.json());
            }
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load project settings");
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, []);

  const handleCopy = () => {
    if (project?.api_key) {
      navigator.clipboard.writeText(project.api_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your workspace and API keys
        </p>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="card mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Workspace</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input
              type="text"
              value={project?.name || ""}
              disabled
              className="input-field disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </div>
          <p className="text-sm text-gray-500">
            Workspace management is limited in the MVP version.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="mb-4 flex items-center gap-2">
          <Key className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">API Access</h2>
        </div>
        <p className="mb-4 text-sm text-gray-600">
          Use this API key to authenticate webhook requests from your Databricks jobs. 
          Keep this key secure and do not expose it in public repositories.
        </p>
        
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Project API Key
          </label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={project?.api_key || ""}
                readOnly
                className="input-field font-mono text-sm"
              />
            </div>
            <button
              onClick={handleCopy}
              className="btn-secondary flex shrink-0 items-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-gray-500" />
                  <span>Copy Key</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
