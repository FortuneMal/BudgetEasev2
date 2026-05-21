import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zlemkzmqxkwinzannlis.supabase.co';
const supabaseKey = 'sb_publishable_ZlocEowSFVbyFLohwaI8Vg_HNzGKgYU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable(tableName) {
  const { data, error } = await supabase.from(tableName).select('*').limit(1);
  if (error) {
    console.log(`Table '${tableName}' check error:`, error.message);
  } else {
    console.log(`Table '${tableName}' exists and works!`);
  }
}

async function main() {
  await checkTable('income');
  await checkTable('budgets');
  await checkTable('goals');
}

main();
