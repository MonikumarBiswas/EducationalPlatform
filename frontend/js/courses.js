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
    card.className =
      "bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition";

    card.innerHTML = `
      <img src="./assests/pic1.png"
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

      <button class="w-24 h-8 mt-2 mx-20 rounded-xl bg-yellow-500 text-black font-bold enroll-btn"
        data-id="${course._id}">
        Enroll
      </button>
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
