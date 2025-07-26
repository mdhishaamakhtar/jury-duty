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
    console.log("No active user session found.");
    return new Response(
      JSON.stringify({ error: "No active user session found." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }

  const { data, error } = await supabase.rpc("get_next_unlabeled_post", {
    uid: user.id,
  });

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
    JSON.stringify({ "data": data }),
    { headers: { "Content-Type": "application/json", ...corsHeaders } },
  );
});
