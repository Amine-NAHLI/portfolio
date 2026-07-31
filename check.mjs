import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://yvpfwjrohccybuylgxqp.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: p } = await supabase.from('projects').select('id').eq('slug', 'smart-network-mapper-plateforme-intelligente-d-audit-reseau').single();
  if (!p) return console.log('no project');
  const { data, error } = await supabase
      .from('project_media')
      .select('media_id, media_assets(storage_path, alt_fr, alt_en)')
      .eq('project_id', p.id);
  console.log(JSON.stringify({data, error}, null, 2));
}
main();
