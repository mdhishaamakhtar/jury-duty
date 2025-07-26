import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  // Access secrets from env vars (set via dashboard or supabase CLI)
  const supabase_url = Deno.env.get('SUPABASE_URL')!
  const supabase_service_role_key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  // Create Supabase client
  const supabase = createClient(supabase_url, supabase_service_role_key)

  // Parse request
  const { user_id } = await req.json()

  if (!user_id) {
    return new Response(JSON.stringify({ error: "Missing user_id" }), {
      status: 400,
    });
  }

  const { data, error } = await supabase.rpc("get_next_unlabeled_post", {
    uid: user_id,
  });

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }

  return new Response(
    JSON.stringify({ "data": data }),
    { headers: { "Content-Type": "application/json" } }
  )
})