import { supabase } from '../config/supabase.js';

// ================= LOGOUT =================
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = '../portal/login.html';
  });
}

// ================= DASHBOARD STATS =================
async function loadDashboardStats() {
  try {
    const { data: courses } = await supabase.from('courses').select('*');
    const { data: projects } = await supabase.from('projects').select('*');
    const { data: students } = await supabase.from('profiles').select('*').eq('role', 'student');
    const { data: blogs } = await supabase.from('blogs').select('*');

    if (document.getElementById('totalCourses'))
      document.getElementById('totalCourses').textContent = courses?.length || 0;

    if (document.getElementById('totalProjects'))
      document.getElementById('totalProjects').textContent = projects?.length || 0;

    if (document.getElementById('totalStudents'))
      document.getElementById('totalStudents').textContent = students?.length || 0;

    if (document.getElementById('totalBlogs'))
      document.getElementById('totalBlogs').textContent = blogs?.length || 0;

  } catch (err) {
    console.error('Stats error:', err.message);
  }
}

loadDashboardStats();

// ================= FOUNDER SECTION =================
const founderForm = document.getElementById('founderForm');
const formMsg = document.getElementById('formMsg');

async function loadFounderInfo() {
  try {
    const { data } = await supabase
      .from('founder_info')
      .select('*')
      .limit(1)
      .single();

    if (data) {
      document.getElementById('founderName').value = data.full_name || '';
      document.getElementById('founderTitle').value = data.title || '';
      document.getElementById('founderBio').value = data.bio || '';
      document.getElementById('founderEducation').value = data.education || '';
      document.getElementById('founderSkills').value = data.skills || '';
    }
  } catch (err) {
    console.log('No founder data yet');
  }
}

loadFounderInfo();

if (founderForm) {
  founderForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      full_name: document.getElementById('founderName').value,
      title: document.getElementById('founderTitle').value,
      bio: document.getElementById('founderBio').value,
      education: document.getElementById('founderEducation').value,
      skills: document.getElementById('founderSkills').value,
      updated_at: new Date()
    };

    const { error } = await supabase.from('founder_info').upsert([payload]);

    if (error) {
      formMsg.textContent = error.message;
      return;
    }

    formMsg.textContent = "Saved successfully ✅";
  });
}
