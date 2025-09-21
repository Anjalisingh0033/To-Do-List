// ====================== GLOBAL TASKS & ELEMENTS ======================
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Main elements
const taskInput = document.querySelector(".taskinput input");
const addBtn = document.querySelector(".taskinput button:first-of-type");
const taskList = document.querySelector(".main .tasklist ul");
const stats = document.querySelector(".stats");
const progress = document.querySelector(".progress");

// Optional buttons (check if exist)
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const pdfBtn = document.getElementById("pdfBtn");
const notifyBtn = document.getElementById("notifyBtn");
const profileBtn = document.getElementById("profileBtn");

// Today / Upcoming / Priority lists
const todayList = document.getElementById("today-task-list");
const upcomingList = document.getElementById("upcoming-task-list");
const highList = document.getElementById("high-list");
const mediumList = document.getElementById("medium-list");
const lowList = document.getElementById("low-list");

// Lists container (for multiple named lists)
const listsContainer = document.getElementById("lists-container");

// ====================== TASK HANDLING ======================

// Add new task
function addTask(text, dueDate = "", priority = "Low", completed = false) {
    if (!text.trim()) return;

    tasks.push({ title: text, dueDate, priority, completed });
    saveTasks();
    renderAllTasks();
}

// Delete a task by index
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderAllTasks();
}

// Toggle task completion
function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderAllTasks();
}

// ====================== SAVE & LOAD ======================
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ====================== TASK RENDERING ======================
function renderAllTasks() {
    renderMainTaskList();
    renderTodayTasks();
    renderUpcomingTasks();
    renderPriorityTasks();
    updateStats();
}

// Main task list rendering
function renderMainTaskList() {
    if (!taskList) return;
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => toggleTaskCompletion(index));

        const span = document.createElement("span");
        span.textContent = task.title;

        const delBtn = document.createElement("button");
        delBtn.textContent = "❌";
        delBtn.addEventListener("click", () => deleteTask(index));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(delBtn);

        taskList.appendChild(li);
    });
}

// Footer stats
function updateStats() {
    if (!stats || !progress) return;
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    stats.textContent = `📊 Pending: ${pending} | Completed: ${completed}`;
    progress.textContent = `⏳ Progress: ${percent}%`;
}

// ====================== TODAY / UPCOMING / PRIORITY ======================
function renderTodayTasks() {
    if (!todayList) return;
    const today = new Date().toISOString().split("T")[0];
    todayList.innerHTML = "";
    tasks.forEach((task, index) => {
        if (task.dueDate === today) {
            const li = createTaskLi(task, index);
            todayList.appendChild(li);
        }
    });
}

function renderUpcomingTasks() {
    if (!upcomingList) return;
    const today = new Date().toISOString().split("T")[0];
    upcomingList.innerHTML = "";
    tasks.forEach((task, index) => {
        if (task.dueDate > today && !task.completed) {
            const li = createTaskLi(task, index);
            upcomingList.appendChild(li);
        }
    });
}

function renderPriorityTasks() {
    if (!highList || !mediumList || !lowList) return;
    highList.innerHTML = "";
    mediumList.innerHTML = "";
    lowList.innerHTML = "";

    tasks.forEach((task, index) => {
        if (!task.completed) {
            const li = createTaskLi(task, index, false);
            if (task.priority === "High") highList.appendChild(li);
            else if (task.priority === "Medium") mediumList.appendChild(li);
            else lowList.appendChild(li);
        }
    });
}

// Create list item element
function createTaskLi(task, index, showDueDate = true) {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTaskCompletion(index));

    li.appendChild(checkbox);

    const text = `${task.title}` + (showDueDate && task.dueDate ? ` (${task.dueDate})` : "");
    const span = document.createElement("span");
    span.textContent = text + ` [${task.priority}]`;
    li.appendChild(span);

    // Optional color coding
    if (task.completed) li.style.backgroundColor = "#c0c0c0";
    else if (task.priority === "High") li.style.backgroundColor = "#f8d7da";
    else if (task.priority === "Medium") li.style.backgroundColor = "#fff3cd";
    else li.style.backgroundColor = "#d1ecf1";

    return li;
}

// ====================== SEARCH ======================
if (searchForm && searchInput) {
    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const query = searchInput.value.toLowerCase();
        taskList.querySelectorAll("li").forEach(li => {
            const text = li.querySelector("span").textContent.toLowerCase();
            li.style.display = text.includes(query) ? "flex" : "none";
        });
    });
}

// ====================== PDF DOWNLOAD ======================
if (pdfBtn) {
    pdfBtn.addEventListener("click", function () {
        const { jsPDF } = window.jspdf;
        let doc = new jsPDF();
        let y = 10;
        tasks.forEach((task, index) => {
            doc.text(`${index + 1}. ${task.title} [${task.priority}] (${task.dueDate || "No date"})`, 10, y);
            y += 10;
        });
        doc.save("tasks.pdf");
    });
}

// ====================== NOTIFICATIONS ======================
if (notifyBtn) {
    notifyBtn.addEventListener("click", function () {
        alert("🔔 You have notifications!");
    });
}

// ====================== PROFILE ======================
if (profileBtn) {
    profileBtn.addEventListener("click", function () {
        const isLoggedIn = false; // Replace with real login
        if (isLoggedIn) window.location.href = "profile.html";
        else {
            alert("⚠️ Please login first!");
            window.location.href = "login.html";
        }
    });
}

// ====================== ADD TASK EVENTS ======================
if (addBtn && taskInput) {
    addBtn.addEventListener("click", () => addTask(taskInput.value));
    taskInput.addEventListener("keypress", e => {
        if (e.key === "Enter") addTask(taskInput.value);
    });
}

// ====================== INITIAL RENDER ======================
renderAllTasks();
