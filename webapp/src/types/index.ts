export interface User {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  owner_id: string;
  name: string;
  api_key: string;
  created_at: string;
}

export interface Pipeline {
  id: string;
  project_id: string;
  name: string;
  source_type: "databricks";
  source_id: string;
  sla_minutes: number;
  expected_cadence_minutes: number;
  current_status: "healthy" | "failed" | "delayed" | "sla_breach" | "unknown";
  last_run_at: string | null;
  created_at: string;
}

export interface PipelineRun {
  id: string;
  pipeline_id: string;
  run_id: string;
  status: "success" | "failed" | "running";
  start_time: string;
  end_time: string | null;
  duration_seconds: number | null;
  rows_processed: number | null;
  metrics: Record<string, unknown> | null;
  created_at: string;
}

export interface Alert {
  id: string;
  pipeline_id: string;
  type: "failure" | "sla_breach" | "staleness";
  message: string;
  notified: boolean;
  created_at: string;
  pipeline?: Pipeline;
}

export interface DashboardMetrics {
  total_pipelines: number;
  healthy_pipelines: number;
  failed_pipelines: number;
  delayed_pipelines: number;
  sla_breached_pipelines: number;
  sla_compliance_percentage: number;
}

export interface WebhookPayload {
  pipeline: string;
  run_id: string;
  status: "success" | "failed" | "running";
  start_time: string;
  end_time?: string;
  duration_seconds?: number;
  rows_processed?: number;
  metrics?: Record<string, unknown>;
}
