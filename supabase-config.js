// =====================================================
// SUPABASE CONFIGURATION
// =====================================================
// Ganti nilai-nilai di bawah ini dengan kredensial Supabase Anda
// Dapatkan dari: https://supabase.com/dashboard/project/_/settings/api

const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';  // Ganti dengan URL project Anda
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';                 // Ganti dengan anon key Anda

// =====================================================
// SUPABASE CLIENT INITIALIZATION
// =====================================================
// Load Supabase SDK dari CDN
const supabaseScript = document.createElement('script');
supabaseScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
supabaseScript.onload = () => {
  if (window.supabase) {
    window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase initialized successfully');
  } else {
    console.error('Supabase SDK failed to load');
  }
};
document.head.appendChild(supabaseScript);

// =====================================================
// UTILITY FUNCTIONS
// =====================================================
async function initSupabase() {
  return new Promise((resolve, reject) => {
    if (window.supabase) {
      resolve(window.supabase);
    } else {
      // Wait for SDK to load
      const checkInterval = setInterval(() => {
        if (window.supabase) {
          clearInterval(checkInterval);
          resolve(window.supabase);
        }
      }, 100);
      
      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error('Supabase initialization timeout'));
      }, 5000);
    }
  });
}

// Example: Save user task to Supabase
async function saveTaskToSupabase(taskData) {
  try {
    const supabase = await initSupabase();
    
    const { data, error } = await supabase
      .from('tasks')  // Table name
      .insert([taskData]);
    
    if (error) {
      console.error('Error saving task:', error);
      return { success: false, error };
    }
    
    console.log('Task saved:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Supabase connection error:', err);
    return { success: false, error: err.message };
  }
}

// Example: Get tasks from Supabase
async function getTasksFromSupabase() {
  try {
    const supabase = await initSupabase();
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching tasks:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (err) {
    console.error('Supabase connection error:', err);
    return { success: false, error: err.message };
  }
}

// Example: User authentication
async function signUp(email, password) {
  try {
    const supabase = await initSupabase();
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error('Error signing up:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (err) {
    console.error('Authentication error:', err);
    return { success: false, error: err.message };
  }
}

// =====================================================
// EXPORT FUNCTIONS (for modular usage)
// =====================================================
// Kembangkan fungsi-fungsi di atas sesuai kebutuhan aplikasi Anda
