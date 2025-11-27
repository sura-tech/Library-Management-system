const toggleBtn = document.getElementById("darkToggle");
const body = document.body;

// Load saved mode
if (localStorage.getItem("dark-mode") === "enabled") {
    body.classList.add("dark-mode");
    toggleBtn.innerText = "☀️ Light Mode";
}

toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("dark-mode", "enabled");
        toggleBtn.innerText = "☀️ Light Mode";
    } else {
        localStorage.removeItem("dark-mode");
        toggleBtn.innerText = "🌙 Dark Mode";
    }
});
