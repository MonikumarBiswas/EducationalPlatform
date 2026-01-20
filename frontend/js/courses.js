const coursesContainer = document.getElementById("coursesContainer");
const seeMoreBtn = document.getElementById("seeMoreBtn");

let allCourses = [];
let showAll = false;

async function loadCourses() {
  try {
    const res = await fetch("http://localhost:3000/course");
    const courses = await res.json();

    allCourses = courses;
    console.log(allCourses);
    renderCourses();

    if (allCourses.length > 3) {
      seeMoreBtn.classList.remove("hidden");
    }
  } catch (err) {
    console.error(err);
    coursesContainer.innerHTML = `<p class="text-red-600">Failed to load courses</p>`;
  }
}

// Render courses
function renderCourses() {
  coursesContainer.innerHTML = "";

  const coursesToShow = showAll ? allCourses : allCourses.slice(0, 3);

  coursesToShow.forEach((course) => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition";

    card.innerHTML = `
      <img src="${course.thumbnail || "/assests/pic1.png"}"
           class="w-full h-40 object-cover rounded-lg mb-4">

      <h3 class="text-lg font-semibold text-gray-800">
        ${course.title}
      </h3>

      <p class="text-gray-600 mt-2 text-sm">
        ${course.description}
      </p>

      <p class="text-blue-600 font-bold mt-3">
        ৳ ${course.price}
      </p>

      <p class="text-gray-500 text-sm mt-1">
        Teacher: ${course.teacherName}
      </p>
    `;

    coursesContainer.appendChild(card);
  });
}

// See more button
seeMoreBtn.addEventListener("click", () => {
  showAll = true;
  renderCourses();
  seeMoreBtn.classList.add("hidden");
});

loadCourses();
