-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Linked to Supabase Auth)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Projects Table
CREATE TABLE public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    api_key TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Pipelines Table
CREATE TABLE public.pipelines (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    source_type TEXT NOT NULL DEFAULT 'databricks',
    source_id TEXT NOT NULL,
    sla_minutes INTEGER NOT NULL,
    expected_cadence_minutes INTEGER NOT NULL,
    current_status TEXT DEFAULT 'unknown',
    last_run_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Pipeline Runs Table
CREATE TABLE public.pipeline_runs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pipeline_id UUID REFERENCES public.pipelines(id) ON DELETE CASCADE NOT NULL,
    run_id TEXT NOT NULL,
    status TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration_seconds INTEGER,
    rows_processed INTEGER,
    metrics JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Alerts Table
CREATE TABLE public.alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pipeline_id UUID REFERENCES public.pipelines(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    notified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Trigger to automatically create a user record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. Row Level Security (RLS) Policies (Basic setup for MVP)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users FOR SELECT USING (auth.uid() = id);

-- Projects are accessible by their owner
CREATE POLICY "Projects accessible by owner" ON public.projects FOR ALL USING (auth.uid() = owner_id);

-- Pipelines are accessible by project owner
CREATE POLICY "Pipelines accessible by owner" ON public.pipelines FOR ALL USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = pipelines.project_id AND owner_id = auth.uid())
);

-- Pipeline runs are accessible by project owner
CREATE POLICY "Runs accessible by owner" ON public.pipeline_runs FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.pipelines p 
    JOIN public.projects pr ON p.project_id = pr.id 
    WHERE p.id = pipeline_runs.pipeline_id AND pr.owner_id = auth.uid()
  )
);

-- Alerts are accessible by project owner
CREATE POLICY "Alerts accessible by owner" ON public.alerts FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.pipelines p 
    JOIN public.projects pr ON p.project_id = pr.id 
    WHERE p.id = alerts.pipeline_id AND pr.owner_id = auth.uid()
  )
);
