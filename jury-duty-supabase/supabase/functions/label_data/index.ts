// supabase/functions/label_data/index.ts
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  // Parse request
  const { user_id, dataset_id, label } = await req.json()

  // Access secrets from env vars (set via dashboard or supabase CLI)
  const supabase_url = Deno.env.get('SUPABASE_URL')!
  const supabase_service_role_key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  // Create Supabase client
  const supabase = createClient(supabase_url, supabase_service_role_key)

  // Insert into table
  const { error } = await supabase
    .from("user_label_interaction")
    .insert([{ user_id, dataset_id, label }])

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }

  return new Response(
    JSON.stringify({ message: "Entry added successfully!" }),
    { headers: { "Content-Type": "application/json" } }
  )
})
