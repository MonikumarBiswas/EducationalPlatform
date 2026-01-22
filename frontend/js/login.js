const loginform = document.getElementById("loginForm");

loginform.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(loginform);
  const data = Object.fromEntries(formData.entries());

  console.log(data);

  const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (result.role === "student") {
    window.location.href = "dashboard.html";
  } else if (result.role === "admin") {
    window.location.href = "admindashboard.html";
  } else if (result.role === "teacher") {
    window.location.href = "teadashboard.html";
  }

  if (result._id) {
    alert(`Welcome, ${result.name}!`);

    localStorage.setItem("userID", result._id);
  } else {
    const errorDiv = document.createElement("div");
    errorDiv.id = "login-error";
    errorDiv.innerText = result.message;
    errorDiv.className = "text-red-600 text-sm text-center mb-4 font-medium";

    loginform.parentElement.insertBefore(errorDiv, loginform);
  }
  console.log(result);
});
