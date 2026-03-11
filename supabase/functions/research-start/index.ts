import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CATEGORIES = [
  "active_personnel", "reserve_personnel", "combat_aircraft", "tanks_armor",
  "naval_vessels", "missiles_inventory", "air_defense_systems", "uav_drone_fleet",
  "interceptor_stockpile", "tel_launchers", "defense_budget", "nuclear_weapons",
  "military_casualties", "civilian_casualties", "ammunition_munitions",
];

const COUNTRIES = ["usa", "israel", "iran"];

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const DEEP_RESEARCH_AGENT = "deep-research-pro-preview-12-2025";

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

    console.log("Starting Deep Research...");

    const response = await fetch(`${GEMINI_API_BASE}/interactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
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

    return new Response(JSON.stringify({
      interaction_id: interactionId,
      status: "started",
      message: "Deep Research initiated. Use research-poll with this interaction_id to check results.",
      poll_url: `/functions/v1/research-poll?interaction_id=${encodeURIComponent(interactionId)}`,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Research start error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
