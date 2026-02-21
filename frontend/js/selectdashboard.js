
async function navigateToDashboard() {
  const userId = localStorage.getItem("userID");
  if (!userId) {
    alert("Please log in first.");
    window.location.href = "login.html";
    return;
  }

  const res = await fetch("http://localhost:3000/selectdashboard", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "user-id": userId,
    },
  });

  const data = await res.json();

  if (data.role === "student") {
    window.location.href = "dashboard.html";
  } else if (data.role === "teacher") {
    window.location.href = "teadashboard.html";
  } else if (data.role === "admin") {
    window.location.href = "admindashboard.html";
  }
}

function logout() {
  localStorage.removeItem("userID");
  window.location.href = "login.html";
}

// Toggle Login / Logout in navbar based on session
function updateAuthButton() {
  const userId = localStorage.getItem("userID");
  const authBtn = document.getElementById("authBtn");
  if (!authBtn) return;

  if (userId) {
    authBtn.textContent = "Logout";
    authBtn.onclick = logout;
    authBtn.className = "bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-1.5 rounded-lg transition";
  } else {
    authBtn.textContent = "Login";
    authBtn.onclick = () => { window.location.href = "login.html"; };
    authBtn.className = "bg-white hover:bg-gray-100 text-blue-700 font-semibold px-4 py-1.5 rounded-lg transition";
  }
}

document.getElementById("dashboard").addEventListener("click", () => {
  navigateToDashboard();
});

updateAuthButton();