import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid Authorization header" }, { status: 401 });
    }

    const apiKey = authHeader.split(" ")[1];
    const supabase = createAdminClient(); // Webhook uses service role since no user session exists

    // 1. Validate API Key & find Project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("api_key", apiKey)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: "Invalid API Key" }, { status: 401 });
    }

    // 2. Parse Webhook Payload
    const payload = await request.json();
    const {
      pipeline: pipelineIdentifier,
      run_id,
      status,
      start_time,
      end_time,
      duration_seconds,
      rows_processed,
      metrics,
    } = payload;

    if (!pipelineIdentifier || !run_id || !status || !start_time) {
      return NextResponse.json({ error: "Missing required fields in payload" }, { status: 400 });
    }

    // 3. Match Pipeline
    const { data: pipeline, error: pipelineError } = await supabase
      .from("pipelines")
      .select("*")
      .eq("project_id", project.id)
      .or(`name.eq."${pipelineIdentifier}",source_id.eq."${pipelineIdentifier}"`)
      .single();

    if (pipelineError || !pipeline) {
      return NextResponse.json({ error: "Pipeline not found or not registered for monitoring" }, { status: 404 });
    }

    // 4. Insert Pipeline Run
    const { error: runError } = await supabase
      .from("pipeline_runs")
      .insert([{
        pipeline_id: pipeline.id,
        run_id,
        status,
        start_time,
        end_time,
        duration_seconds,
        rows_processed,
        metrics,
      }]);

    if (runError) {
      console.error("Error inserting run:", runError);
      return NextResponse.json({ error: "Failed to record pipeline run" }, { status: 500 });
    }

    // 5. Evaluate Health & Update Pipeline
    let current_status = "healthy";
    let alertType = null;
    let alertMessage = null;

    if (status === "failed") {
      current_status = "failed";
      alertType = "failure";
      alertMessage = `Pipeline run failed. Run ID: ${run_id}`;
    } else if (duration_seconds && pipeline.sla_minutes && (duration_seconds / 60) > pipeline.sla_minutes) {
      current_status = "sla_breach";
      alertType = "sla_breach";
      alertMessage = `Pipeline exceeded SLA of ${pipeline.sla_minutes}m. Took ${Math.round(duration_seconds / 60)}m.`;
    }

    // Update pipeline status
    await supabase
      .from("pipelines")
      .update({
        current_status,
        last_run_at: start_time // or end_time, using start_time as requested usually represents latest trigger
      })
      .eq("id", pipeline.id);

    // 6. Create Alert if needed
    if (alertType) {
      await supabase
        .from("alerts")
        .insert([{
          pipeline_id: pipeline.id,
          type: alertType,
          message: alertMessage,
          notified: false
        }]);
    }

    return NextResponse.json({ success: true, message: "Webhook processed successfully" });

  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
