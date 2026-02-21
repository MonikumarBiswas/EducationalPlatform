const coursesContainer = document.getElementById("coursesContainer");
const seeMoreBtn = document.getElementById("seeMoreBtn");

let allCourses = [];
let showAll = false;

async function loadCourses() {
  try {
    const res = await fetch("http://localhost:3000/course");
    const courses = await res.json();

    allCourses = courses;
    showCourses();

    if (allCourses.length > 3) {
      seeMoreBtn.classList.remove("hidden");
    }
  } catch (err) {
    console.error(err);
    coursesContainer.innerHTML = `<p class="text-red-600">Failed to load courses</p>`;
  }
}

function showCourses() {
  coursesContainer.innerHTML = "";

  const coursesToShow = showAll ? allCourses : allCourses.slice(0, 3);

  coursesToShow.forEach((course) => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition";

    // Thumbnail: use uploaded image or fallback
    const thumbSrc = course.thumbnail
      ? `http://localhost:3000/${course.thumbnail}`
      : "./assests/pic1.png";

    card.innerHTML = `
      <img src="${thumbSrc}" 
           onerror="this.src='./assests/pic1.png'"
           class="w-full h-44 object-cover">

      <div class="p-5">
        <h3 class="text-lg font-semibold text-gray-800">${course.title}</h3>

        <p class="text-gray-600 mt-2 text-sm line-clamp-2">${course.description}</p>

        <p class="text-blue-600 font-bold mt-3">৳ ${course.price}</p>

        <p class="text-gray-500 text-sm mt-1">Teacher: ${course.teacherName}</p>

        <button class="w-full mt-4 py-2 rounded-xl bg-yellow-500 text-black font-bold enroll-btn hover:bg-yellow-400 transition"
          data-id="${course._id}">
          Enroll Now
        </button>
      </div>
    `;

    coursesContainer.appendChild(card);
  });
}

coursesContainer.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("enroll-btn")) return;

  const course_id = e.target.dataset.id;
  const userID = localStorage.getItem("userID");

  if (!userID) {
    alert("You must be logged in to enroll!");
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/enroll/${course_id}`, {
      method: "POST",
      headers: {
        "user-id": userID,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    alert(data.message);
  } catch (err) {
    console.error(err);
    alert("Failed to enroll course");
  }
});

seeMoreBtn.addEventListener("click", () => {
  showAll = true;
  showCourses();
  seeMoreBtn.classList.add("hidden");
});

loadCourses();
