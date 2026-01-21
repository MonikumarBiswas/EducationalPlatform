 async function loadStudentDashboard() {
      try {
        const userId = localStorage.getItem("userID");

        const res = await fetch("http://localhost:3000/dashboard", {
          method: "GET",
          headers:{
             "user-id": userId
          }
          
        });

        if (!res.ok) {
          console.log("user not defined.") ;
        }

        const person = await res.json();

        // Populate student info
        document.getElementById("studentName").innerText = person.name;
        document.getElementById("studentEmail").innerText = person.email;
        document.getElementById("studentBalance").innerText = "TK : " + person.studentBalance;
        document.getElementById("cnumber").innerHTML = `<p class= "font-bold text-lg p-2">Total Enrolled courses : ${person.enrolledCourses.length} </p>` 


        // Populate enrolled courses
        const coursesContainer = document.getElementById("enrolledCourses");
        coursesContainer.innerHTML = ""; 
        if (person.enrolledCourses.length === 0) {
          coursesContainer.innerHTML = '<p class="text-gray-500">No courses enrolled yet.</p>';
        } else {
          
          person.enrolledCourses.forEach(course => {
            const courseCard = document.createElement("div");
            courseCard.className = "bg-blue-50 rounded-xl shadow p-4 hover:shadow-lg transition duration-300";
            courseCard.innerHTML = `
              <h4 class="font-semibold text-gray-800 text-lg">${course.title}</h4>
              <p class="text-gray-600 mt-1">${course.description}</p>
              <p class="text-gray-500 mt-2 text-sm">Instructor: ${course.price}</p>
              <a class="text-[#DA27F5] mt-2 font-bold text-lg" href = "${course.videoLink}"> Class Link  </a>  <br> 
              <a class="text-[#27A9F5] mt-2 font-bold text-lg" href = "${course.materials}"> Class Materials </a> 
            `;
            coursesContainer.appendChild(courseCard);
          });
        }

      } catch (err) {
        console.error(err);
        const coursesContainer = document.getElementById("enrolledCourses");
        coursesContainer.innerHTML = '<p class="text-red-600">Failed to load dashboard. Please try again.</p>';
      }
    }

    loadStudentDashboard();


  document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("userID");
  window.location.href = "login.html";
});

document.getElementById("homeBtn").addEventListener("click" ,() =>{
   window.location.href = "index.html" ; 
})

