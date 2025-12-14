let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(sessionStorage.getItem("currentUser")) || null;

if (currentUser) {
  showDashboard();
}

function showPage(page) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  if (page === "login") {
    document.getElementById("loginPage").classList.add("active");
  } else if (page === "register") {
    document.getElementById("registerPage").classList.add("active");
  } else if (page === "dashboard") {
    document.getElementById("dashboardPage").classList.add("active");
  }
}

function showAlert(elementId, message, type) {
  const alertDiv = document.getElementById(elementId);
  alertDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
  setTimeout(() => {
    alertDiv.innerHTML = "";
  }, 3000);
}

document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document
      .getElementById("registerEmail")
      .value.trim()
      .toLowerCase();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById(
      "registerConfirmPassword"
    ).value;

    if (password !== confirmPassword) {
      showAlert("registerAlert", "Passwords do not match!", "error");
      return;
    }

    if (password.length < 6) {
      showAlert(
        "registerAlert",
        "Password must be at least 6 characters!",
        "error"
      );
      return;
    }

    const userExists = users.find((u) => u.email === email);
    if (userExists) {
      showAlert("registerAlert", "Email already registered!", "error");
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: name,
      email: email,
      password: password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    showAlert(
      "registerAlert",
      "Registration successful! Redirecting to login...",
      "success"
    );

    document.getElementById("registerForm").reset();

    setTimeout(() => {
      showPage("login");
      showAlert("loginAlert", "Please login with your credentials", "success");
    }, 1500);
  });

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document
    .getElementById("loginEmail")
    .value.trim()
    .toLowerCase();
  const password = document.getElementById("loginPassword").value;

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    showAlert("loginAlert", "Invalid email or password!", "error");
    return;
  }

  user.lastLogin = new Date().toISOString();
  localStorage.setItem("users", JSON.stringify(users));

  currentUser = user;
  sessionStorage.setItem("currentUser", JSON.stringify(user));

  showAlert("loginAlert", "Login successful! Redirecting...", "success");

  document.getElementById("loginForm").reset();

  setTimeout(() => {
    showDashboard();
  }, 1000);
});

function showDashboard() {
  if (!currentUser) {
    showPage("login");
    return;
  }

  document.getElementById("userName").textContent =
    currentUser.name.split(" ")[0];
  document.getElementById("userFullName").textContent = currentUser.name;
  document.getElementById("userEmail").textContent = currentUser.email;
  document.getElementById("lastLogin").textContent = currentUser.lastLogin
    ? new Date(currentUser.lastLogin).toLocaleString()
    : "First time login";

  showPage("dashboard");
}

function logout() {
  sessionStorage.removeItem("currentUser");
  currentUser = null;
  showPage("login");
  showAlert("loginAlert", "You have been logged out successfully", "success");
}

window.addEventListener("popstate", function () {
  if (!currentUser) {
    showPage("login");
  }
});
