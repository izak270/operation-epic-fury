import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a military intelligence analyst assistant for the "Force Posture" dashboard — a real-time open-source intelligence (OSINT) platform tracking military capabilities of the USA, Israel, and Iran.

You have deep knowledge of:
- Military personnel (active + reserve), fighter aircraft, tanks, naval vessels
- Missile arsenals (ballistic, cruise, UAV/drones), TEL launchers, interceptor stockpiles
- Air defense systems (Iron Dome, David's Sling, Arrow, Patriot, S-300, Bavar-373)
- Defense budgets, nuclear capabilities, uranium enrichment status
- Casualty figures (military and civilian) from ongoing conflicts
- Munitions expenditure and cost analysis
- Iranian fire rate collapse and capability erosion trends
- US/Coalition strike operations and defense cost equations

Guidelines:
- Answer in the same language the user writes in (Hebrew or English)
- Be concise, data-driven, and cite sources when possible
- When comparing countries, use structured formats
- If you're unsure about a specific number, say so and give a range
- You can explain charts and data shown on the dashboard
- If the user wants to submit feedback, corrections, or suggestions — use the submit_feedback tool

IMPORTANT: You are NOT a general-purpose chatbot. Stay focused on military intelligence, defense analysis, and the dashboard's data.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversation_id, session_id } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase credentials not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Ensure conversation exists
    let convId = conversation_id;
    if (!convId) {
      const { data: conv, error } = await supabase
        .from("chat_conversations")
        .insert({ session_id: session_id || "anonymous" })
        .select("id")
        .single();
      if (error) throw error;
      convId = conv.id;
    }

    // Save user message
    const lastUserMsg = messages[messages.length - 1];
    if (lastUserMsg?.role === "user") {
      await supabase.from("chat_messages").insert({
        conversation_id: convId,
        role: "user",
        content: lastUserMsg.content,
      });
    }

    // Call AI with tools
    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "submit_feedback",
                description: "Submit user feedback, data correction, or feature suggestion to the Force Posture team",
                parameters: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                      enum: ["correction", "suggestion", "feature", "other"],
                      description: "Type of feedback",
                    },
                    category: {
                      type: "string",
                      description: "Category (e.g. missiles, personnel, charts)",
                    },
                    message: {
                      type: "string",
                      description: "The feedback content",
                    },
                  },
                  required: ["type", "message"],
                },
              },
            },
          ],
          stream: true,
        }),
      }
    );

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded", conversation_id: convId }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required", conversation_id: convId }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      throw new Error(`AI error: ${aiResponse.status}`);
    }

    // We need to handle tool calls. Stream through but intercept tool calls.
    // For simplicity with tool calls, we'll consume the stream, handle tools, then return.
    const reader = aiResponse.body!.getReader();
    const decoder = new TextDecoder();
    let fullContent = "";
    let toolCalls: any[] = [];
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let newlineIdx: number;
      while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, newlineIdx);
        buffer = buffer.slice(newlineIdx + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const delta = parsed.choices?.[0]?.delta;
          if (delta?.content) fullContent += delta.content;
          if (delta?.tool_calls) {
            for (const tc of delta.tool_calls) {
              if (tc.index !== undefined) {
                while (toolCalls.length <= tc.index) toolCalls.push({ id: "", function: { name: "", arguments: "" } });
                if (tc.id) toolCalls[tc.index].id = tc.id;
                if (tc.function?.name) toolCalls[tc.index].function.name = tc.function.name;
                if (tc.function?.arguments) toolCalls[tc.index].function.arguments += tc.function.arguments;
              }
            }
          }
        } catch { /* partial */ }
      }
    }

    // Handle tool calls
    let feedbackSubmitted = false;
    for (const tc of toolCalls) {
      if (tc.function.name === "submit_feedback") {
        try {
          const args = JSON.parse(tc.function.arguments);
          await supabase.from("feedback").insert({
            type: args.type || "other",
            category: args.category || null,
            message: args.message,
            contact: null,
          });
          feedbackSubmitted = true;
        } catch (e) {
          console.error("Feedback insert error:", e);
        }
      }
    }

    // If there were tool calls but no content, generate follow-up
    if (toolCalls.length > 0 && !fullContent) {
      const toolResults = toolCalls.map((tc) => ({
        role: "tool" as const,
        tool_call_id: tc.id,
        content: feedbackSubmitted ? "Feedback submitted successfully" : "Tool executed",
      }));

      const followUp = await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...messages,
              { role: "assistant", content: null, tool_calls: toolCalls.map((tc, i) => ({ id: tc.id, type: "function", function: tc.function, index: i })) },
              ...toolResults,
            ],
          }),
        }
      );

      if (followUp.ok) {
        const followData = await followUp.json();
        fullContent = followData.choices?.[0]?.message?.content || "✅";
      }
    }

    // Save assistant message
    if (fullContent) {
      await supabase.from("chat_messages").insert({
        conversation_id: convId,
        role: "assistant",
        content: fullContent,
      });
    }

    return new Response(
      JSON.stringify({
        conversation_id: convId,
        content: fullContent || "...",
        feedback_submitted: feedbackSubmitted,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
