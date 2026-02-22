async function loadStudentDashboard() {
  try {
    const userId = localStorage.getItem("userID");

    const res = await fetch("http://localhost:3000/dashboard", {
      method: "GET",
      headers: { "user-id": userId },
    });

    const person = await res.json();

    document.getElementById("studentName").innerText = person.name;
    document.getElementById("studentEmail").innerText = person.email;
    document.getElementById("studentBalance").innerText = "TK " + person.studentBalance;
    document.getElementById("cnumber").innerHTML =
      `📚 Enrolled Courses <span class="text-blue-600">(${person.enrolledCourses.length})</span>`;

    const coursesContainer = document.getElementById("enrolledCourses");
    coursesContainer.innerHTML = "";

    if (!person.enrolledCourses || person.enrolledCourses.length === 0) {
      coursesContainer.innerHTML =
        '<p class="text-gray-400 col-span-2">No courses enrolled yet. <a href="courses.html" class="text-blue-600 underline">Browse courses</a></p>';
      return;
    }

    // quizPassed comes as populated objects OR plain IDs — handle both
    const quizPassedIds = (person.quizPassed || []).map((item) =>
      typeof item === "object" ? item._id.toString() : item.toString()
    );

    person.enrolledCourses.forEach((course) => {
      const hasPassed = quizPassedIds.includes(course._id.toString());


      // ── YouTube iframe   
      let embedUrl = "";
      if (course.videoLink) {
        embedUrl = course.videoLink;
        // Handle both "youtu.be/ID" and "youtube.com/watch?v=ID" links
        const watchMatch = embedUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?\/]+)/);
        if (watchMatch) {
          embedUrl = `https://www.youtube.com/embed/${watchMatch[1]}`;
        }
      }

      const videoBlock = embedUrl
        ? `<div class="rounded-lg overflow-hidden bg-black">
             <iframe
               src="${embedUrl}"
               width="100%" height="220"
               frameborder="0"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               allowfullscreen
               class="w-full block">
             </iframe>
           </div>`
        : `<p class="text-gray-400 text-sm italic px-1">No video available for this course.</p>`;

      // ── Card 
      const card = document.createElement("div");
      card.className = "bg-white rounded-2xl shadow-md overflow-hidden flex flex-col";

      card.innerHTML = `
        <div class="p-5 flex flex-col gap-3 flex-1">

          <!-- Title only -->
          <h4 class="font-bold text-gray-800 text-xl">${course.title}</h4>

          <!-- Embedded Video -->
          <div>
            ${videoBlock}
          </div>

          <!-- Materials -->
          ${course.materials && course.materials.trim() && course.materials.trim() !== " "
            ? `<a href="${course.materials}" target="_blank"
                 class="flex items-center gap-2 text-blue-600 font-medium text-sm hover:underline">
                 📄 Course Materials
               </a>`
            : ""}

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-2 mt-auto pt-2 border-t">
            <a href="quiz.html?courseId=${course._id}"
               class="flex-1 min-w-[130px] text-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-xl transition text-sm">
               📝 Take Quiz
            </a>
            ${hasPassed
              ? `<a href="certificate.html?userId=${userId}&courseId=${course._id}"
                   class="flex-1 min-w-[130px] text-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl transition text-sm">
                   🎓 Get Certificate
                 </a>`
              : `<span class="flex-1 min-w-[130px] text-center border border-gray-200 text-gray-400 text-xs py-2 px-4 rounded-xl">
                   🔒 Pass quiz to unlock certificate
                 </span>`}
          </div>

        </div>
      `;

      coursesContainer.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    document.getElementById("enrolledCourses").innerHTML =
      '<p class="text-red-500 col-span-2">Failed to load dashboard. Please try again.</p>';
  }
}

loadStudentDashboard();

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("userID");
  window.location.href = "login.html";
});

document.getElementById("homeBtn").addEventListener("click", () => {
  window.location.href = "index.html";
});
