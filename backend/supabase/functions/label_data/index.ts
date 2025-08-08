// supabase/functions/label_data/index.ts
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Parse request
  const { dataset_id, label } = await req.json();

  // Access secrets from env vars (set via dashboard or supabase CLI)
  const supabase_url = Deno.env.get("SUPABASE_URL")!;
  const supabase_service_role_key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Create Supabase client
  const supabase = createClient(supabase_url, supabase_service_role_key);

  const userSupabase = createClient(supabase_url, supabase_service_role_key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        Authorization: req.headers.get("Authorization")!,
      },
    },
  });

  const { data: { user }, error: userError } = await userSupabase.auth
    .getUser();

  if (userError) {
    console.error("Error getting user:", userError.message);
    return new Response(
      JSON.stringify({ error: userError.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }

  if (user == null) {
    console.error("No active user session found.");
    return new Response(
      JSON.stringify({ error: "No active user session found." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }

  // Update existing "started" entry to "completed" with label
  const { error } = await supabase
    .from("user_label_interaction")
    .update({ label, status: 'completed' })
    .eq('user_id', user.id)
    .eq('dataset_id', dataset_id)
    .eq('status', 'started');

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }

  return new Response(
    JSON.stringify({ message: "Entry added successfully!" }),
    { headers: { "Content-Type": "application/json", ...corsHeaders } },
  );
});
