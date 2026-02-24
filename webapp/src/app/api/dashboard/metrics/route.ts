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
    return NextResponse.json({
      total_pipelines: 0,
      healthy_pipelines: 0,
      failed_pipelines: 0,
      delayed_pipelines: 0,
      sla_compliance_percentage: 0,
    });
  }

  const { data: pipelines, error } = await supabase
    .from("pipelines")
    .select("*")
    .eq("project_id", projects[0].id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let healthy = 0;
  let failed = 0;
  let delayed = 0;
  let slaBreach = 0;

  const now = Date.now();

  pipelines.forEach((p) => {
    // Dynamic staleness check based on current time
    const isFresh = p.last_run_at 
      ? (now - new Date(p.last_run_at).getTime()) / 60000 <= p.expected_cadence_minutes
      : false;

    if (!isFresh && p.last_run_at) {
      delayed++;
    } else if (p.current_status === "healthy" || p.current_status === "success") {
      healthy++;
    } else if (p.current_status === "failed") {
      failed++;
    } else if (p.current_status === "sla_breach") {
      slaBreach++;
    }
  });

  const total = pipelines.length;
  // Calculate SLA compliance: (healthy + delayed) / total * 100
  // Note: delayed doesn't necessarily mean SLA breach on run duration, just staleness.
  const compliantCount = total - failed - slaBreach;
  const compliancePercentage = total > 0 ? Math.round((compliantCount / total) * 100) : 100;

  return NextResponse.json({
    total_pipelines: total,
    healthy_pipelines: healthy,
    failed_pipelines: failed,
    delayed_pipelines: delayed,
    sla_breached_pipelines: slaBreach,
    sla_compliance_percentage: compliancePercentage,
  });
}
