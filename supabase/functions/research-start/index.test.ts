import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;

Deno.test("research-start: CORS preflight", async () => {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/research-start`, { method: "OPTIONS" });
  assertEquals(res.status, 200);
  assertEquals(res.headers.get("access-control-allow-origin"), "*");
  await res.text();
});

Deno.test("research-start: POST returns interaction_id", async () => {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/research-start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  const body = await res.json();
  console.log("Start response:", JSON.stringify(body).substring(0, 300));

  assertEquals(res.status, 200);
  assertExists(body.interaction_id);
  assertEquals(body.status, "started");
  
  // Store for poll test
  Deno.env.set("TEST_INTERACTION_ID", body.interaction_id);
});

Deno.test("research-poll: returns 400 without interaction_id", async () => {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/research-poll`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({}),
  });
  const body = await res.json();
  assertEquals(res.status, 400);
  assertEquals(body.error, "interaction_id is required");
});

Deno.test("research-poll: polls with interaction_id", async () => {
  const interactionId = Deno.env.get("TEST_INTERACTION_ID");
  if (!interactionId) {
    console.log("Skipping — no interaction_id from start test");
    return;
  }

  const res = await fetch(`${SUPABASE_URL}/functions/v1/research-poll?interaction_id=${encodeURIComponent(interactionId)}`, {
    method: "GET",
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  const body = await res.json();
  console.log("Poll response:", JSON.stringify(body).substring(0, 500));

  assertEquals(res.status, 200);
  // Should be in_progress since Deep Research takes 5-10 min
  assertExists(body.status);
  console.log(`Poll status: ${body.status}`);
});
