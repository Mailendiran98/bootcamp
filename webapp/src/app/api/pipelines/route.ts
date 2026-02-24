import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user's project first
  const { data: projects } = await supabase
    .from("projects")
    .select("id")
    .eq("owner_id", session.user.id)
    .limit(1);

  if (!projects || projects.length === 0) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabase
    .from("pipelines")
    .select("*")
    .eq("project_id", projects[0].id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("id")
    .eq("owner_id", session.user.id)
    .limit(1);

  if (!projects || projects.length === 0) {
    return NextResponse.json({ error: "No project found" }, { status: 400 });
  }

  const body = await request.json();
  
  const { data, error } = await supabase
    .from("pipelines")
    .insert([{
      ...body,
      project_id: projects[0].id,
      source_type: "databricks",
      current_status: "unknown"
    }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
