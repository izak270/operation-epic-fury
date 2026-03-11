import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

const CATEGORIES = [
  "active_personnel", "reserve_personnel", "combat_aircraft", "tanks_armor",
  "naval_vessels", "missiles_inventory", "air_defense_systems", "uav_drone_fleet",
  "interceptor_stockpile", "tel_launchers", "defense_budget", "nuclear_weapons",
  "military_casualties", "civilian_casualties", "ammunition_munitions",
];
const COUNTRIES = ["usa", "israel", "iran"];

function extractJsonFromText(text: string, tag?: string): any[] {
  if (tag) {
    const taggedMatch = text.match(new RegExp("```" + tag + "\\s*\\n?([\\s\\S]*?)```"));
    if (taggedMatch) return JSON.parse(taggedMatch[1].trim());
  }
  const codeBlockMatch = text.match(/```json\s*\n?([\s\S]*?)```/);
  if (codeBlockMatch) return JSON.parse(codeBlockMatch[1].trim());
  const arrayMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (arrayMatch) return JSON.parse(arrayMatch[0]);
  throw new Error(`Could not extract JSON array${tag ? ` (tag: ${tag})` : ""}`);
}

function extractTextFromResponse(data: any): string {
  const outputs = data.outputs || data.result?.outputs || [];
  let fullText = "";
  for (const output of outputs) {
    if (output.text) fullText += output.text + "\n";
    else if (output.parts) {
      for (const part of output.parts) {
        if (part.text) fullText += part.text + "\n";
      }
    }
  }
  if (!fullText && data.response?.candidates) {
    for (const candidate of data.response.candidates) {
      for (const part of candidate.content?.parts || []) {
        if (part.text) fullText += part.text + "\n";
      }
    }
  }
  return fullText;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase credentials not configured");

    // Get interaction_id from query params or body
    const url = new URL(req.url);
    let interactionId = url.searchParams.get("interaction_id");
    if (!interactionId && req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      interactionId = body.interaction_id;
    }
    if (!interactionId) {
      return new Response(JSON.stringify({ error: "interaction_id is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Polling interaction: ${interactionId}`);

    // Poll Gemini API (single poll, no loop — caller retries)
    const response = await fetch(`${GEMINI_API_BASE}/interactions/${interactionId}`, {
      method: "GET",
      headers: { "x-goog-api-key": GEMINI_API_KEY },
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Poll failed: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const status = data.status || data.state;
    console.log(`Status: ${status}`);

    // Still in progress
    if (status === "COMPLETED" || status === "DONE") {
      // Fall through to parse results
    } else if (status === "FAILED" || status === "ERROR" || status === "CANCELLED" || status === "cancelled") {
      throw new Error(`Deep Research ${status}: ${data.error?.message || "Task was cancelled or failed"}`);
    } else {
      // Still in progress
      return new Response(JSON.stringify({
        status: "in_progress",
        raw_status: status,
        interaction_id: interactionId,
        message: "Research still in progress. Poll again in 10-15 seconds.",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Completed — extract and store results
    const fullText = extractTextFromResponse(data);
    if (!fullText.trim()) throw new Error("Completed but no text output found");

    console.log("Research output length:", fullText.length);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const batchId = crypto.randomUUID();

    // Parse forces
    let parsed: any[];
    let forecastParsed: any[] = [];

    try {
      parsed = extractJsonFromText(fullText, "json-forces");
    } catch {
      try {
        parsed = extractJsonFromText(fullText);
      } catch {
        await supabase.from("data_research").insert({
          category: "parse_error", country: "all",
          raw_response: fullText.substring(0, 10000), batch_id: batchId,
        });
        throw new Error("Failed to parse research output as JSON");
      }
    }

    // Parse forecast
    try {
      forecastParsed = extractJsonFromText(fullText, "json-forecast");
      console.log(`Forecast parsed: ${forecastParsed.length} days`);
    } catch {
      console.warn("No forecast data found, continuing without it");
    }

    // Get previous batch for comparison
    const { data: prevBatch } = await supabase
      .from("data_research")
      .select("category, country, current_value")
      .neq("category", "parse_error")
      .neq("category", "forecast")
      .order("created_at", { ascending: false })
      .limit(CATEGORIES.length * COUNTRIES.length);

    const prevMap = new Map<string, string>();
    if (prevBatch) {
      for (const row of prevBatch) {
        prevMap.set(`${row.category}:${row.country}`, row.current_value || "");
      }
    }

    // Build rows
    const rows = parsed.map((item: any) => ({
      category: item.category, country: item.country,
      current_value: String(item.current_value),
      previous_value: prevMap.get(`${item.category}:${item.country}`) || null,
      change_description: item.change_description || null,
      source: item.source || null,
      confidence: item.confidence || "medium",
      raw_response: null, batch_id: batchId,
    }));

    const forecastRows = forecastParsed.map((item: any) => ({
      category: "forecast", country: `day_${item.day}`,
      current_value: JSON.stringify({
        day: item.day, date: item.date, ballistic: item.ballistic,
        uav: item.uav, activeTELs: item.activeTELs, interceptRate: item.interceptRate,
        confidencePct: item.confidencePct, eventEn: item.eventEn, eventHe: item.eventHe,
        usMunitionsSpentUSD: item.usMunitionsSpentUSD,
        iranBMStockRemaining: item.iranBMStockRemaining,
        israelArrowStockRemaining: item.israelArrowStockRemaining,
      }),
      change_description: item.eventEn,
      source: "Deep Research Forecast",
      confidence: item.confidencePct > 70 ? "high" : item.confidencePct > 50 ? "medium" : "low",
      raw_response: null, batch_id: batchId,
    }));

    const { error: insertError } = await supabase
      .from("data_research").insert([...rows, ...forecastRows]);

    if (insertError) throw new Error(`DB insert failed: ${insertError.message}`);

    const changedItems = rows.filter(r => r.previous_value && r.previous_value !== r.current_value);

    const summary = {
      status: "completed", batch_id: batchId,
      timestamp: new Date().toISOString(),
      total_items: rows.length, forecast_items: forecastRows.length,
      changes_detected: changedItems.length,
      interaction_id: interactionId,
      items: rows, forecast: forecastParsed, changes: changedItems,
    };

    console.log(`Complete: ${rows.length} items, ${forecastRows.length} forecast, ${changedItems.length} changes`);

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Poll error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
