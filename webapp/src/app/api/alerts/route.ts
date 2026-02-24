import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user's project
  const { data: projects } = await supabase
    .from("projects")
    .select("id")
    .eq("owner_id", session.user.id)
    .limit(1);

  if (!projects || projects.length === 0) {
    return NextResponse.json([]);
  }

  // Get pipelines for the project
  const { data: pipelines } = await supabase
    .from("pipelines")
    .select("id")
    .eq("project_id", projects[0].id);

  if (!pipelines || pipelines.length === 0) {
    return NextResponse.json([]);
  }

  const pipelineIds = pipelines.map(p => p.id);

  // Fetch alerts with pipeline joins
  const { data, error } = await supabase
    .from("alerts")
    .select("*, pipeline:pipelines(id, name, source_id)")
    .in("pipeline_id", pipelineIds)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
