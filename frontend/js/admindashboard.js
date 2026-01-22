async function loadAdminDashboard() {
  try {
    const userId = localStorage.getItem("userID");

    if (!userId) {
      window.location.href = "login.html";
      return;
    }

    const res = await fetch("http://localhost:3000/admin-dashboard", {
      method: "GET",
      headers: {
        "user-id": userId,
      },
    });

    if (!res.ok) {
      throw new Error("User not authorized");
    }

    const person = await res.json();

    document.getElementById("adminName").innerText = person.name;
    document.getElementById("adminEmail").innerText = person.email;
    document.getElementById("adminBalance").innerText =
      "TK : " + person.totalEarnings;

    const coursesContainer = document.getElementById("enrolledCourses");
    coursesContainer.innerHTML = "";
    if (person.enrolledCourses.length === 0) {
      coursesContainer.innerHTML =
        '<p class="text-gray-500">No courses sold yet.</p>';
    } else {
      const coursesContainer = document.getElementById("enrolledCourses");

      // Create table
      const table = document.createElement("table");
      table.className = "min-w-full bg-white rounded-lg shadow";

      table.innerHTML = `
    <thead class="bg-blue-600 text-white w-full">
      <tr>
        <th class="px-20 py-2 text-left">Course ID</th>
        <th class="px-20 py-2 text-left">Course Name</th>
        <th class="px-20 py-2 text-left">Teacher</th>
        <th class="px-20 py-2 text-left">Price</th>
      </tr>
    </thead>
    <tbody id="courseTableBody"></tbody>
  `;

      coursesContainer.appendChild(table);

      const tbody = document.getElementById("courseTableBody");

      person.enrolledCourses.forEach((course) => {
        const row = document.createElement("tr");
        row.className = "border-b hover:bg-blue-50";

        row.innerHTML = `
      <td class="px-20 py-2 text-sm text-gray-700">${course._id}</td>
      <td class="px-20 py-2 font-medium text-gray-800">${course.title}</td>
      <td class="px-20 py-2 text-gray-700">${course.teacherName || "N/A"}</td>
      <td class="px-20 py-2 text-green-600 font-semibold">TK ${course.price}</td>
    `;

        tbody.appendChild(row);
      });
    }
  } catch (err) {
    console.error(err);
    const coursesContainer = document.getElementById("enrolledCourses");
    coursesContainer.innerHTML =
      '<p class="text-red-600">Failed to load dashboard. Please try again.</p>';
  }
}

loadAdminDashboard();

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("userId");

  window.location.href = "login.html";
});

// Home
document.getElementById("homeBtn").addEventListener("click", () => {
  window.location.href = "index.html";
});
