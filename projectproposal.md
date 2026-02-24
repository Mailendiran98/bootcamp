🚀 PipelinePulse — Backend Proposal (MVP)
📌 Overview

PipelinePulse is a lightweight SaaS platform that provides a centralized, business-friendly dashboard for monitoring data pipeline health, freshness, and SLA compliance.

This MVP focuses on monitoring existing Databricks pipelines by ingesting run metadata through a webhook endpoint. PipelinePulse does not create or execute pipelines. It acts purely as a monitoring and visualization layer on top of existing data infrastructure.

🎯 The goal of this version is to:

Accept pipeline run events

Store run metadata

Compute health and freshness

Display metrics in a clean dashboard

Provide basic alerting for failures and delays

🧭 Product Scope (Important Clarification)
PipelinePulse:

❌ Does NOT create pipelines
❌ Does NOT orchestrate or schedule jobs
❌ Does NOT replace Databricks

PipelinePulse:

✅ Monitors existing Databricks jobs
✅ Stores run metadata
✅ Calculates SLA compliance
✅ Tracks freshness
✅ Displays run history
✅ Shows health indicators

In this version, we support Databricks pipelines only.
Other sources like Airflow, ADF, and dbt are not included in this MVP.

🏗 Architecture Design

PipelinePulse follows a simple SaaS web application architecture.

🖥 Frontend

Built with Next.js.

Provides:

Signup / Login pages

Dashboard page

Pipeline management pages

Pipeline detail page

Settings page (API key visibility)

The frontend consumes internal API routes to fetch and display data.

⚙ Backend

Implemented using Next.js API routes.

Responsible for:

Handling authentication (via Supabase)

Managing projects and pipelines

Validating webhook requests

Inserting pipeline run records

Calculating dashboard metrics

Generating alerts

All business logic related to pipeline health computation lives in the backend.

🗄 Database

PostgreSQL (via Supabase)

Stores:

Users

Projects

Pipelines

Pipeline runs

Alerts

The schema is intentionally simple and extendable.

🔌 Ingestion Mechanism

Webhook-based ingestion.

Databricks jobs send run metadata to:

POST /api/webhook

Each request must include:

Authorization: Bearer <API_KEY>

The API key is generated per project.

This approach avoids complex OAuth or deep integrations and keeps the system lightweight.

🧩 Feature Design (MVP Only)
1️⃣ Authentication & Workspace

Users can:

Sign up

Log in

Create a project (workspace)

Each project:

Has a unique API key

Owns multiple pipelines

Is associated with a single user

The API key is used to authenticate webhook calls from Databricks jobs.

2️⃣ Pipeline Registration (Monitoring Configuration)

Users can create a pipeline entry inside PipelinePulse.

⚠ This does NOT create a real pipeline.
It only registers a pipeline for monitoring.

Each pipeline includes:

name (logical name)

source_type = "databricks"

source_id (Databricks job name or ID)

sla_minutes

expected_cadence_minutes

This configuration enables:

SLA violation detection

Freshness detection

Status computation

3️⃣ Webhook Ingestion
Endpoint
POST /api/webhook
Responsibilities

When a webhook request is received:

Validate API key

Identify project

Match pipeline using name or source_id

Insert a new pipeline run record

Update pipeline’s current status

Evaluate:

SLA violation

Freshness violation

Create alert record if needed

4️⃣ Dashboard

The dashboard provides a high-level overview of pipeline health.

📊 Top-Level Metrics

Total pipelines

Healthy pipelines

Failed pipelines

Delayed pipelines

SLA compliance percentage

🧠 Health Logic

A pipeline is considered:

Healthy → Last run successful and within SLA

Failed → Last run status = failed

Delayed → No run within expected cadence

SLA Breach → Duration exceeds sla_minutes

5️⃣ Pipeline Table View

For each pipeline:

Name

Current status

Last run timestamp

Average duration

Freshness indicator

SLA status

This table gives a quick operational overview.

6️⃣ Pipeline Detail Page

Each pipeline has a detail page containing:

🔎 Overview Section

Current status

Last run time

SLA configuration

Expected cadence

📜 Run History

List of recent runs with:

run_id

status

duration

rows_processed

timestamp

📈 Trend Visualizations

Duration trend over last 7 runs

Status distribution (success vs failure)

7️⃣ Run History Tracking

Each webhook call creates a new record in pipeline_runs.

Stored attributes:

run_id

status (success | failed | running)

start_time

end_time

duration_seconds

rows_processed

metrics (JSON)

created_at

These records power:

Dashboard metrics

Trend charts

SLA evaluation

Freshness logic

8️⃣ Alerts (Basic In-App)

When:

A run fails

A pipeline exceeds SLA

A pipeline becomes stale

The system:

Inserts a record into alerts

Displays alert indicator in UI

No Slack or email integrations in this version.

🗂 Database Design

The schema is intentionally simple.

👤 users

id (UUID, primary key)

email (unique)

name (nullable)

created_at

🏢 projects

id (UUID, primary key)

owner_id (FK → users.id)

name

api_key

created_at

Each project represents a workspace.

🔄 pipelines

id (UUID, primary key)

project_id (FK → projects.id)

name

source_type (Databricks)

source_id

sla_minutes

expected_cadence_minutes

created_at

Represents a monitored pipeline configuration.

📦 pipeline_runs

id (UUID, primary key)

pipeline_id (FK → pipelines.id)

run_id

status (success | failed | running)

start_time

end_time

duration_seconds

rows_processed

metrics (JSON)

created_at

Stores historical run data.

🚨 alerts

id (UUID, primary key)

pipeline_id (FK → pipelines.id)

type (failure | sla_breach | staleness)

message

notified (boolean)

created_at

📩 Webhook Payload Contract

Example request body:

{
  "pipeline": "sales_etl",
  "run_id": "dbx_run_2026_02_22_001",
  "status": "success",
  "start_time": "2026-02-22T02:05:00Z",
  "end_time": "2026-02-22T02:09:00Z",
  "duration_seconds": 240,
  "rows_processed": 120000,
  "metrics": {
    "source_max_ts": "2026-02-22T01:55:00Z"
  }
}

Required header:

Authorization: Bearer <API_KEY>