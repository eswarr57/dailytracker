const API_BASE = "https://dailytracker-611b.onrender.com/api";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "./login.html";
}

/*
 LOGOUT
*/
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "./login.html";
});

/*
 FETCH STREAK
*/
async function fetchStreak() {
  try {
    const res = await fetch(`${API_BASE}/analytics/streak`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (data.success) {
      document.getElementById("streakCount").textContent =
        `${data.streak} days`;
    }

  } catch (error) {
    console.error("Streak error:", error);
  }
}

/*
 FETCH WEEKLY
*/
async function fetchWeeklyAnalytics() {
  try {
    const res = await fetch(`${API_BASE}/analytics/weekly`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (data.success) {
      renderWeeklyChart(data.analytics);
    }

  } catch (error) {
    console.error("Weekly analytics error:", error);
  }
}

/*
 FETCH MONTHLY
*/
async function fetchMonthlyAnalytics() {
  try {
    const res = await fetch(`${API_BASE}/analytics/monthly`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (data.success) {
      renderMonthlyChart(data.analytics);
    }

  } catch (error) {
    console.error("Monthly analytics error:", error);
  }
}

/*
 WEEKLY CHART
*/
function renderWeeklyChart(analytics) {
  const labels = analytics.map(item => item.date);
  const values = analytics.map(item => item.percentage);

  const ctx = document.getElementById("weeklyChart").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Completion %",
          data: values
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

/*
 MONTHLY CHART
*/
function renderMonthlyChart(analytics) {
  const labels = analytics.map(item => item.date);
  const values = analytics.map(item => item.percentage);

  const ctx = document.getElementById("monthlyChart").getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Completion %",
          data: values
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

/*
 INIT
*/
fetchStreak();
fetchWeeklyAnalytics();
fetchMonthlyAnalytics();