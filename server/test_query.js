import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://eflxicthczsxnoegeinx.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmbHhpY3RoY3pzeG5vZWdlaW54Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDAzNjkwMywiZXhwIjoyMDg1NjEyOTAzfQ.Dy3hroE0-SsgsNLLTBI64fuGRKi2va-G3zXT3-tIApA');

async function test() {
  const { data, error } = await supabase
    .from('training_sessions')
    .select(`
      *,
      student:profiles!student_id (id, full_name, avatar_url),
      court:courts!court_id (id, name, type)
    `);
  if (error) console.error("Error:", JSON.stringify(error, null, 2));
  else console.log("Success:", data);
}
test();
