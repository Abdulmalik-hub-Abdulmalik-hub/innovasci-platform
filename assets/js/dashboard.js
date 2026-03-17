import { supabase } from "../../config/supabase.js";

const clientNameSpan = document.getElementById("clientName");
const projectForm = document.getElementById("projectForm");
const projectsList = document.getElementById("projectsList");

// Display client name
async function loadClientName() {
  const user = supabase.auth.user();
  if(user){
    clientNameSpan.innerText = user.user_metadata.full_name || user.email;
  }
}

// Submit new project
if(projectForm){
  projectForm.addEventListener("submit", async(e)=>{
    e.preventDefault();
    const title = document.getElementById("projectTitle").value;
    const desc = document.getElementById("projectDesc").value;
    const files = document.getElementById("projectFiles").files;

    // Insert project record
    const {data: projectData, error: insertError} = await supabase
      .from("projects")
      .insert([{
        client_id: supabase.auth.user().id,
        title: title,
        description: desc,
        status: "Pending Review"
      }]).single();

    if(insertError){
      alert("Error submitting project: "+insertError.message);
      return;
    }

    // Upload files to storage bucket
    for(let file of files){
      await supabase.storage
      .from("project-files")
      .upload(`${projectData.id}/${file.name}`, file);
    }

    alert("Project submitted successfully!");
    projectForm.reset();
    loadProjects();
  });
}

// Load projects
async function loadProjects(){
  const {data, error} = await supabase
    .from("projects")
    .select("*")
    .eq("client_id", supabase.auth.user().id)
    .order("created_at", {ascending:false});

  if(error){
    projectsList.innerHTML = "Error loading projects";
    return;
  }

  projectsList.innerHTML = "";
  data.forEach(p=>{
    const div = document.createElement("div");
    div.innerHTML = `
      <h4>${p.title} - Status: ${p.status}</h4>
      <p>${p.description}</p>
    `;
    projectsList.appendChild(div);
  });
}

// Initialize
loadClientName();
loadProjects();
