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

const SYSTEM_PROMPT = `You are a military intelligence research analyst. Your task is to find the most recent, credible data on military force posture for USA, Israel, and Iran.

For each category and country combination, provide:
1. The most current estimated value (number or text)
2. The source of this data (e.g., "GlobalFirepower 2026", "IISS Military Balance", "SIPRI", "CSIS", "IDF Spokesperson")
3. Your confidence level: "high" (official/verified source), "medium" (credible estimate), "low" (unverified/single source)
4. A brief note on any recent changes

Focus on data from the last 30 days. Use multiple sources to cross-reference.

IMPORTANT: Respond ONLY with valid JSON. No markdown, no explanation outside the JSON.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase credentials not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const batchId = crypto.randomUUID();

    console.log(`Starting research batch ${batchId}`);

    // Build the research prompt
    const userPrompt = `Research the current military force posture for USA, Israel, and Iran as of today (${new Date().toISOString().split("T")[0]}).

Provide data for these categories: ${CATEGORIES.join(", ")}
Countries: ${COUNTRIES.join(", ")}

Return a JSON array of objects with this exact structure:
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

Include one object per category-country combination (${CATEGORIES.length * COUNTRIES.length} total).
For values that are genuinely unknown, use "N/A" as current_value.
For numerical values, use plain numbers as strings (no commas).
For budgets, use full numbers in USD (e.g., "831500000000").`;

    // Call Lovable AI Gateway
    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errText);
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices?.[0]?.message?.content;
    if (!rawContent) throw new Error("No content in AI response");

    console.log("Raw AI response length:", rawContent.length);

    // Parse JSON from response (handle markdown code blocks)
    let parsed: any[];
    try {
      const jsonStr = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse AI response:", rawContent.substring(0, 500));
      // Store raw response for debugging
      await supabase.from("data_research").insert({
        category: "parse_error",
        country: "all",
        raw_response: rawContent,
        batch_id: batchId,
      });
      throw new Error("Failed to parse AI response as JSON");
    }

    if (!Array.isArray(parsed)) throw new Error("AI response is not an array");

    // Get previous batch for comparison
    const { data: prevBatch } = await supabase
      .from("data_research")
      .select("category, country, current_value")
      .neq("category", "parse_error")
      .order("created_at", { ascending: false })
      .limit(CATEGORIES.length * COUNTRIES.length);

    const prevMap = new Map<string, string>();
    if (prevBatch) {
      for (const row of prevBatch) {
        prevMap.set(`${row.category}:${row.country}`, row.current_value || "");
      }
    }

    // Insert research results
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

    const { error: insertError } = await supabase
      .from("data_research")
      .insert(rows);

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error(`DB insert failed: ${insertError.message}`);
    }

    // Build summary for Notion
    const changedItems = rows.filter(
      (r) => r.previous_value && r.previous_value !== r.current_value
    );

    const summary = {
      batch_id: batchId,
      timestamp: new Date().toISOString(),
      total_items: rows.length,
      changes_detected: changedItems.length,
      items: rows,
      changes: changedItems,
    };

    console.log(
      `Research complete: ${rows.length} items, ${changedItems.length} changes`
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
