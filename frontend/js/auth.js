const API_BASE = "http://localhost:5000/api";

/*
 REGISTER
*/
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const data = await res.json();

      if (data.success) {
        message.style.color = "green";
        message.textContent = "Registration successful! Redirecting...";

        setTimeout(() => {
          window.location.href = "./login.html";
        }, 1500);

      } else {
        message.style.color = "red";
        message.textContent = data.message;
      }

    } catch (error) {
      message.style.color = "red";
      message.textContent = "Server error";
    }
  });
}

/*
 LOGIN
*/
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);

        message.style.color = "green";
        message.textContent = "Login successful!";

        setTimeout(() => {
          window.location.href = "./index.html";
        }, 1000);

      } else {
        message.style.color = "red";
        message.textContent = data.message;
      }

    } catch (error) {
      message.style.color = "red";
      message.textContent = "Server error";
    }
  });
}