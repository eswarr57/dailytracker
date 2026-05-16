const API_BASE = "https://dailytracker-611b.onrender.com/api";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "./login.html";
}

let tasks = [];
let statuses = [];
let dates = [];

/*
 DEFAULT DATES
*/
function generateDefaultDates() {
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    dates.push(d.toISOString().split("T")[0]);
  }
}

/*
 FETCH TASKS
*/
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

/*
 CHECK STATUS
*/
function isCompleted(taskId, date) {
  return statuses.some(
    (status) =>
      status.taskId === taskId &&
      status.date === date &&
      status.completed
  );
}

/*
 RENDER TABLE
*/
function renderTable() {
  const headRow = document.getElementById("tableHeadRow");
  const tableBody = document.getElementById("taskTableBody");

  headRow.innerHTML = `<th class="sticky-col">Task Name</th>`;
  tableBody.innerHTML = "";

  dates.forEach((date) => {
    headRow.innerHTML += `<th>${date}</th>`;
  });

  tasks.forEach((task) => {
    const row = document.createElement("tr");

    let rowHTML = `
      <td class="sticky-col task-name-cell">
        ${task.taskName}
        <span class="task-actions">
          <button class="edit-btn" onclick="editTask('${task._id}')">
            Edit
          </button>
          <button class="delete-btn" onclick="deleteTask('${task._id}')">
            Delete
          </button>
        </span>
      </td>
    `;

    dates.forEach((date) => {
      const checked = isCompleted(task._id, date) ? "checked" : "";

      rowHTML += `
        <td>
          <input
            type="checkbox"
            ${checked}
            onchange="toggleStatus('${task._id}', '${date}', this.checked)"
          />
        </td>
      `;
    });

    row.innerHTML = rowHTML;
    tableBody.appendChild(row);
  });
}

/*
 ADD TASK
*/
async function addTask() {
  const taskName = prompt("Enter task name:");

  if (!taskName) return;

  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ taskName })
    });

    const data = await res.json();

    if (data.success) {
      fetchTasks();
    }
  } catch (error) {
    console.error(error);
  }
}

/*
 EDIT TASK
*/
async function editTask(taskId) {
  const taskName = prompt("Enter updated task name:");

  if (!taskName) return;

  try {
    const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ taskName })
    });

    const data = await res.json();

    if (data.success) {
      fetchTasks();
    }
  } catch (error) {
    console.error(error);
  }
}

/*
 DELETE TASK
*/
async function deleteTask(taskId) {
  const confirmDelete = confirm("Delete this task?");

  if (!confirmDelete) return;

  try {
    const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (data.success) {
      fetchTasks();
    }
  } catch (error) {
    console.error(error);
  }
}

/*
 TOGGLE STATUS
*/
async function toggleStatus(taskId, date, completed) {
  try {
    const res = await fetch(`${API_BASE}/tasks/status/${taskId}`, {
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

    const data = await res.json();

    if (data.success) {
      fetchTasks();
    }
  } catch (error) {
    console.error(error);
  }
}

/*
 ADD DATE
*/
function addDate() {
  const dateInput = prompt("Enter date (YYYY-MM-DD)");

  if (!dateInput) return;

  if (!dates.includes(dateInput)) {
    dates.push(dateInput);
    renderTable();
    updateSummary();
  }
}

/*
 SUMMARY
*/
function updateSummary() {
  const totalTasks = tasks.length;
  let completedCount = 0;

  statuses.forEach((status) => {
    if (status.completed) {
      completedCount++;
    }
  });

  const pendingCount = totalTasks > completedCount
    ? totalTasks - completedCount
    : 0;

  const percentage =
    totalTasks > 0
      ? Math.round((completedCount / (totalTasks * dates.length)) * 100)
      : 0;

  document.getElementById("totalTasks").textContent =
    `Total Tasks: ${totalTasks}`;

  document.getElementById("completedTasks").textContent =
    `Completed: ${completedCount}`;

  document.getElementById("pendingTasks").textContent =
    `Pending: ${pendingCount}`;

  document.getElementById("completionPercent").textContent =
    `Completion: ${percentage}%`;
}

/*
 LOGOUT
*/
function logout() {
  localStorage.removeItem("token");
  window.location.href = "./login.html";
}

/*
 EVENTS
*/
document.getElementById("addTaskBtn").addEventListener("click", addTask);
document.getElementById("addDateBtn").addEventListener("click", addDate);
document.getElementById("logoutBtn").addEventListener("click", logout);

/*
 INIT
*/
generateDefaultDates();
fetchTasks();