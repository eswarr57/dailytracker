const API_BASE = "https://dailytracker-611b.onrender.com/api";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "./login.html";
}

let tasks = [];
let statuses = [];
let dates = [];

function generateDefaultDates() {
  const savedDates = localStorage.getItem("trackerDates");

  if (savedDates) {
    dates = JSON.parse(savedDates);
    return;
  }

  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }

  localStorage.setItem("trackerDates", JSON.stringify(dates));
}

function ensureTodayExists() {
  const today = new Date().toISOString().split("T")[0];

  if (!dates.includes(today)) {
    dates.push(today);
    dates.sort();
    localStorage.setItem("trackerDates", JSON.stringify(dates));
  }
}

async function fetchTasks() {
  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (data.success) {
      tasks = data.tasks;
      statuses = data.statuses;
      renderTable();
      updateSummary();
    }

  } catch (error) {
    console.error(error);
  }
}

function getStatus(taskId, date) {
  const status = statuses.find(
    (s) =>
      String(s.taskId) === String(taskId) &&
      s.date === date
  );

  if (!status) return null;

  return status.completed;
}

function renderTable() {
  const headRow = document.getElementById("tableHeadRow");
  const tableBody = document.getElementById("taskTableBody");

  headRow.innerHTML = `<th class="sticky-col">Task Name</th>`;
  tableBody.innerHTML = "";

  dates.sort();

  dates.forEach((date) => {
    headRow.innerHTML += `<th>${date}</th>`;
  });

  tasks.forEach((task) => {
    const row = document.createElement("tr");

    let rowHTML = `
      <td class="sticky-col task-name-cell">
        ${task.taskName}
        <span class="task-actions">
          <button class="edit-btn" onclick="editTask('${task._id}')">Edit</button>
          <button class="delete-btn" onclick="deleteTask('${task._id}')">Delete</button>
        </span>
      </td>
    `;

    dates.forEach((date) => {
      const status = getStatus(task._id, date);

      let symbol = "⬜";

      if (status === true) symbol = "✅";
      if (status === false) symbol = "❌";

      rowHTML += `
        <td>
          <span
            class="status-icon"
            onclick="cycleStatus('${task._id}', '${date}')"
          >
            ${symbol}
          </span>
        </td>
      `;
    });

    row.innerHTML = rowHTML;
    tableBody.appendChild(row);
  });
}

async function cycleStatus(taskId, date) {
  const current = getStatus(taskId, date);

  let next;

  if (current === null) {
    next = true;
  } else if (current === true) {
    next = false;
  } else {
    next = null;
  }

  if (next === null) {
    await deleteStatus(taskId, date);
  } else {
    await saveStatus(taskId, date, next);
  }
}

async function saveStatus(taskId, date, completed) {
  try {
    await fetch(`${API_BASE}/tasks/status/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        date,
        completed
      })
    });

    fetchTasks();

  } catch (error) {
    console.error(error);
  }
}

async function deleteStatus(taskId, date) {
  try {
    await fetch(`${API_BASE}/tasks/status/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ date })
    });

    fetchTasks();

  } catch (error) {
    console.error(error);
  }
}

async function addTask() {
  const taskName = prompt("Enter task name:");

  if (!taskName) return;

  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ taskName })
  });

  const data = await res.json();

  if (data.success) fetchTasks();
}

async function editTask(taskId) {
  const taskName = prompt("Enter updated task name:");

  if (!taskName) return;

  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ taskName })
  });

  const data = await res.json();

  if (data.success) fetchTasks();
}

async function deleteTask(taskId) {
  if (!confirm("Delete task?")) return;

  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();

  if (data.success) fetchTasks();
}

function addDate() {
  const dateInput = prompt("Enter date (YYYY-MM-DD)");

  if (!dateInput) return;

  if (!dates.includes(dateInput)) {
    dates.push(dateInput);
    dates.sort();
    localStorage.setItem("trackerDates", JSON.stringify(dates));
    renderTable();
  }
}

function updateSummary() {
  const totalTasks = tasks.length;

  const completedCount = statuses.filter(
    (s) => s.completed === true
  ).length;

  const failedCount = statuses.filter(
    (s) => s.completed === false
  ).length;

  document.getElementById("totalTasks").textContent =
    `Total Tasks: ${totalTasks}`;

  document.getElementById("completedTasks").textContent =
    `Completed: ${completedCount}`;

  document.getElementById("pendingTasks").textContent =
    `Not Done: ${failedCount}`;
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "./login.html";
}

document.getElementById("addTaskBtn").addEventListener("click", addTask);
document.getElementById("addDateBtn").addEventListener("click", addDate);
document.getElementById("logoutBtn").addEventListener("click", logout);

generateDefaultDates();
ensureTodayExists();
fetchTasks();