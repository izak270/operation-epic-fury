import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CATEGORIES = [
  "active_personnel",
  "reserve_personnel",
  "combat_aircraft",
  "tanks_armor",
  "naval_vessels",
  "missiles_inventory",
  "air_defense_systems",
  "uav_drone_fleet",
  "interceptor_stockpile",
  "tel_launchers",
  "defense_budget",
  "nuclear_weapons",
  "military_casualties",
  "civilian_casualties",
  "ammunition_munitions",
];

const COUNTRIES = ["usa", "israel", "iran"];

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const DEEP_RESEARCH_AGENT = "deep-research-pro-preview-12-2025";
const POLL_INTERVAL_MS = 10_000; // 10 seconds
const MAX_POLL_TIME_MS = 10 * 60 * 1000; // 10 minutes

const RESEARCH_PROMPT = `Research the current military force posture for USA, Israel, and Iran as of today (${new Date().toISOString().split("T")[0]}).

PART 1 — FORCE DATA
Find the most recent, credible data for these categories:
${CATEGORIES.join(", ")}

For each category and country combination, provide:
1. The most current estimated value (number or text)
2. The source of this data (e.g., "GlobalFirepower 2026", "IISS Military Balance", "SIPRI", "CSIS")
3. Your confidence level: "high" (official/verified), "medium" (credible estimate), "low" (unverified)
4. A brief note on any recent changes

PART 2 — CONFLICT FORECAST (Days 11-30)
Based on the conflict data from the first 10 days of "Operation Wrath" (Feb 28 – Mar 9, 2026):
- Day 1: 480 BMs + 720 UAVs, 300 TELs, 87% intercept
- Day 2: 520 BMs + 850 UAVs (peak), 270 TELs, 85% intercept  
- Day 5: 250 BMs + 350 UAVs, 160 TELs, 92% intercept
- Day 10: 40 BMs + 30 UAVs, 120 TELs, 98% intercept

Project the following for days 11, 12, 13, 15, 18, 21, 25, 30:
- Daily ballistic missile launches (considering TEL attrition, stockpile depletion)
- Daily UAV launches (considering shift to attrition strategy with cheap Shahed drones)
- Active TEL count (considering coalition strikes and production rate of ~5-8/month)
- Intercept rate % (considering interceptor stock depletion, SM-3 at $28M each)
- Strategic event description (English and Hebrew)
- Confidence percentage (decreasing over time)

Also provide updated cost projections:
- Estimated total US munitions spending by day 30
- Estimated Iranian remaining ballistic missile stockpile
- Estimated Israeli Arrow interceptor remaining stock

Return TWO JSON arrays wrapped in code blocks:

\`\`\`json-forces
[
  {
    "category": "active_personnel",
    "country": "usa",
    "current_value": "1328000",
    "change_description": "Slight decrease from 2025 levels",
    "source": "GlobalFirepower 2026",
    "confidence": "high"
  }
]
\`\`\`

Include one object per category-country combination (${CATEGORIES.length * COUNTRIES.length} total).

\`\`\`json-forecast
[
  {
    "day": 11,
    "date": "2026-03-10",
    "ballistic": 35,
    "uav": 25,
    "activeTELs": 118,
    "interceptRate": 98,
    "confidencePct": 85,
    "eventEn": "Description of strategic situation",
    "eventHe": "תיאור המצב האסטרטגי",
    "usMunitionsSpentUSD": 2000000000,
    "iranBMStockRemaining": 800,
    "israelArrowStockRemaining": 150
  }
]
\`\`\`

For numerical values, use plain numbers as strings (no commas).
For budgets, use full numbers in USD (e.g., "831500000000").
For values that are genuinely unknown, use "N/A" as current_value.`;

async function startDeepResearch(apiKey: string): Promise<string> {
  const response = await fetch(`${GEMINI_API_BASE}/interactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      input: RESEARCH_PROMPT,
      agent: DEEP_RESEARCH_AGENT,
      background: true,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Deep Research start error:", response.status, errText);
    throw new Error(`Failed to start Deep Research: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  const interactionId = data.name || data.id;
  if (!interactionId) {
    console.error("No interaction ID in response:", JSON.stringify(data));
    throw new Error("No interaction ID returned from Deep Research API");
  }

  console.log(`Deep Research started: ${interactionId}`);
  return interactionId;
}

async function pollForResults(apiKey: string, interactionId: string): Promise<string> {
  const startTime = Date.now();

  while (Date.now() - startTime < MAX_POLL_TIME_MS) {
    const response = await fetch(`${GEMINI_API_BASE}/interactions/${interactionId}`, {
      method: "GET",
      headers: {
        "x-goog-api-key": apiKey,
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Poll error:", response.status, errText);
      throw new Error(`Poll failed: ${response.status}`);
    }

    const data = await response.json();
    const status = data.status || data.state;
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    console.log(`Poll [${elapsed}s]: status=${status}`);

    if (status === "COMPLETED" || status === "DONE") {
      // Extract text from outputs
      const outputs = data.outputs || data.result?.outputs || [];
      let fullText = "";
      for (const output of outputs) {
        if (output.text) {
          fullText += output.text + "\n";
        } else if (output.parts) {
          for (const part of output.parts) {
            if (part.text) fullText += part.text + "\n";
          }
        }
      }

      // Fallback: check response content
      if (!fullText && data.response?.candidates) {
        for (const candidate of data.response.candidates) {
          for (const part of candidate.content?.parts || []) {
            if (part.text) fullText += part.text + "\n";
          }
        }
      }

      if (!fullText.trim()) {
        console.error("Completed but no text found in:", JSON.stringify(data).substring(0, 1000));
        throw new Error("Deep Research completed but no text output found");
      }

      return fullText;
    }

    if (status === "FAILED" || status === "ERROR") {
      console.error("Deep Research failed:", JSON.stringify(data));
      throw new Error(`Deep Research failed: ${data.error?.message || "Unknown error"}`);
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  throw new Error("Deep Research timed out after 10 minutes");
}

function extractJsonFromText(text: string, tag?: string): any[] {
  // Try tagged code block first
  if (tag) {
    const taggedMatch = text.match(new RegExp("```" + tag + "\\s*\\n?([\\s\\S]*?)```"));
    if (taggedMatch) {
      return JSON.parse(taggedMatch[1].trim());
    }
  }

  // Try generic json code block
  const codeBlockMatch = text.match(/```json\s*\n?([\s\S]*?)```/);
  if (codeBlockMatch) {
    return JSON.parse(codeBlockMatch[1].trim());
  }

  // Try to find a JSON array directly
  const arrayMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (arrayMatch) {
    return JSON.parse(arrayMatch[0]);
  }

  throw new Error(`Could not extract JSON array${tag ? ` (tag: ${tag})` : ""} from Deep Research output`);
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
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase credentials not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const batchId = crypto.randomUUID();

    console.log(`Starting Deep Research batch ${batchId}`);

    // Step 1: Start Deep Research
    const interactionId = await startDeepResearch(GEMINI_API_KEY);

    // Step 2: Poll for completion
    const researchText = await pollForResults(GEMINI_API_KEY, interactionId);
    console.log("Research output length:", researchText.length);

    // Step 3: Parse force data JSON
    let parsed: any[];
    let forecastParsed: any[] = [];
    
    try {
      parsed = extractJsonFromText(researchText, "json-forces");
    } catch {
      try {
        parsed = extractJsonFromText(researchText); // fallback to generic
      } catch (e) {
        console.error("Failed to parse forces:", researchText.substring(0, 500));
        await supabase.from("data_research").insert({
          category: "parse_error",
          country: "all",
          raw_response: researchText.substring(0, 10000),
          batch_id: batchId,
        });
        throw new Error("Failed to parse Deep Research output as JSON");
      }
    }

    // Step 3b: Parse forecast JSON
    try {
      forecastParsed = extractJsonFromText(researchText, "json-forecast");
      console.log(`Forecast data parsed: ${forecastParsed.length} days`);
    } catch (e) {
      console.warn("No forecast data found in research output, continuing without it");
    }

    if (!Array.isArray(parsed)) throw new Error("Research output is not an array");

    // Step 4: Get previous batch for comparison
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

    // Step 5: Insert force research results
    const rows = parsed.map((item: any) => ({
      category: item.category,
      country: item.country,
      current_value: String(item.current_value),
      previous_value: prevMap.get(`${item.category}:${item.country}`) || null,
      change_description: item.change_description || null,
      source: item.source || null,
      confidence: item.confidence || "medium",
      raw_response: null,
      batch_id: batchId,
    }));

    // Step 5b: Insert forecast results as special category rows
    const forecastRows = forecastParsed.map((item: any) => ({
      category: "forecast",
      country: `day_${item.day}`,
      current_value: JSON.stringify({
        day: item.day,
        date: item.date,
        ballistic: item.ballistic,
        uav: item.uav,
        activeTELs: item.activeTELs,
        interceptRate: item.interceptRate,
        confidencePct: item.confidencePct,
        eventEn: item.eventEn,
        eventHe: item.eventHe,
        usMunitionsSpentUSD: item.usMunitionsSpentUSD,
        iranBMStockRemaining: item.iranBMStockRemaining,
        israelArrowStockRemaining: item.israelArrowStockRemaining,
      }),
      change_description: item.eventEn,
      source: "Deep Research Forecast",
      confidence: item.confidencePct > 70 ? "high" : item.confidencePct > 50 ? "medium" : "low",
      raw_response: null,
      batch_id: batchId,
    }));

    const allRows = [...rows, ...forecastRows];

    const { error: insertError } = await supabase
      .from("data_research")
      .insert(allRows);

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error(`DB insert failed: ${insertError.message}`);
    }

    // Step 6: Build summary
    const changedItems = rows.filter(
      (r) => r.previous_value && r.previous_value !== r.current_value
    );

    const summary = {
      batch_id: batchId,
      timestamp: new Date().toISOString(),
      total_items: rows.length,
      forecast_items: forecastRows.length,
      changes_detected: changedItems.length,
      deep_research_interaction_id: interactionId,
      items: rows,
      forecast: forecastParsed,
      changes: changedItems,
    };

    console.log(
      `Deep Research complete: ${rows.length} items, ${changedItems.length} changes`
    );

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Research error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
