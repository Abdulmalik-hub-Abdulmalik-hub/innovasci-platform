// Mobile navigation toggle

const menuToggle = document.getElementById("menuToggle")
const navMenu = document.getElementById("navMenu")

menuToggle.addEventListener("click", () => {

if(navMenu.style.display === "block"){
navMenu.style.display = "none"
}else{
navMenu.style.display = "block"
}

})
