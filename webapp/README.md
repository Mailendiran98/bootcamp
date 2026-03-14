# PipelinePulse

A lightweight SaaS platform for monitoring data pipeline health, freshness, and SLA compliance. Built with Next.js, Tailwind CSS, and Supabase.

**🔗 Live Demo:** [https://pipelinepulse.vercel.app](https://pipelinepulse.vercel.app)

## 🚀 Setup Instructions

### 1. Database Setup (Supabase)
1. Create a new project on [Supabase](https://supabase.com/).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of `database.sql` and run it to create the required tables, triggers, and Row Level Security (RLS) policies.

### 2. Environment Variables
1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Fill in your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon public key.
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service_role key (required for webhook ingestion bypassing RLS).

### 3. Install Dependencies & Run
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🔌 Testing the Webhook

You can simulate a Databricks job run by sending a POST request to your webhook endpoint once the app is running:

```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PROJECT_API_KEY" \
  -d '{
    "pipeline": "sales_etl",
    "run_id": "dbx_run_12345",
    "status": "success",
    "start_time": "2026-02-24T10:00:00Z",
    "end_time": "2026-02-24T10:05:00Z",
    "duration_seconds": 300,
    "rows_processed": 150000,
    "metrics": {
      "source_max_ts": "2026-02-24T09:55:00Z"
    }
  }'
```
*(You can find your API Key in the PipelinePulse Settings page after creating an account)*
