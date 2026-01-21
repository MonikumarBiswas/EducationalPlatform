async function loadTeacherDashboard() {
  try {
    const userId = localStorage.getItem("userID");

    if (!userId) {
      window.location.href = "login.html";
      return;
    }

    const res = await fetch("http://localhost:3000/teacher-dashboard", {
      headers: {
        "user-id": userId,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch teacher data");
    }

    const person = await res.json();

    // Teacher info
    document.getElementById("teacherName").innerText = person.name;
    document.getElementById("teacherEmail").innerText = person.email;
    document.getElementById("teacherBalance").innerText = "TK " + person.balance;
    document.getElementById("cnumber").innerHTML = `<p class= "font-bold text-lg p-2">Total Uploaded courses : ${person.courses.length} </p>` 
  
    document.getElementById("uploadbtn").addEventListener("click", () => {
     window.location.href = "uploadPage.html";
    });



    // Courses
    const container = document.getElementById("uploadedCourses");
    container.innerHTML = "";

    if (person.courses.length === 0) {
      container.innerHTML =
        '<p class="text-gray-500">No courses uploaded yet.</p>';
        return;
    }

   

    person.courses.forEach(course => {
      const div = document.createElement("div");
      div.className =
        "bg-blue-50 rounded-xl shadow p-4 hover:shadow-lg transition";

      div.innerHTML = `
        <h4 class="font-semibold text-lg">${course.title}</h4>
        <p class="text-gray-600">${course.description}</p>
        <p class="text-sm text-gray-500">Price: TK ${course.price}</p>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    document.getElementById("uploadedCourses").innerHTML =
      '<p class="text-red-600">Failed to load dashboard</p>';
  }
}

loadTeacherDashboard();

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("userID");
  window.location.href = "login.html";
});

// Home
document.getElementById("homeBtn").addEventListener("click", () => {
  window.location.href = "index.html";
});
