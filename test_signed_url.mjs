import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yvpfwjrohccybuylgxqp.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.storage.from('portfolio-media').createSignedUrl('2026/07/test.png', 60);
  console.log({data, error});
}
main();
