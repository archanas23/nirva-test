// Debug script to check what's in the database
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugDatabase() {
  console.log('🔍 Debugging database...');
  
  // Check user_booked_classes table
  console.log('\n📋 Checking user_booked_classes table:');
  const { data: bookedClasses, error: bookedError } = await supabase
    .from('user_booked_classes')
    .select('*');
  
  if (bookedError) {
    console.log('❌ Error loading user_booked_classes:', bookedError);
  } else {
    console.log('✅ user_booked_classes data:', bookedClasses);
  }
  
  // Check class_instances table
  console.log('\n📋 Checking class_instances table:');
  const { data: classInstances, error: instancesError } = await supabase
    .from('class_instances')
    .select('*');
  
  if (instancesError) {
    console.log('❌ Error loading class_instances:', instancesError);
  } else {
    console.log('✅ class_instances data:', classInstances);
  }
  
  // Check if class_instance_id column exists
  console.log('\n🔍 Checking if class_instance_id column exists:');
  const { data: columns, error: columnsError } = await supabase
    .rpc('get_table_columns', { table_name: 'user_booked_classes' });
  
  if (columnsError) {
    console.log('❌ Error checking columns:', columnsError);
  } else {
    console.log('✅ Columns in user_booked_classes:', columns);
  }
}

debugDatabase().catch(console.error);
