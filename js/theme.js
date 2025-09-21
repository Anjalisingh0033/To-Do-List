document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("theme-toggle");
  const body = document.body;

  toggleBtn.addEventListener("click", () => {
    if (body.classList.contains("day-mode")) {
      body.classList.remove("day-mode");
      body.classList.add("dark-mode");
      toggleBtn.textContent = "☀️ Switch to Day";
    } else {
      body.classList.remove("dark-mode");
      body.classList.add("day-mode");
      toggleBtn.textContent = "🌙 Switch to Night";
    }
  });

  // set default
  body.classList.add("day-mode");
});
