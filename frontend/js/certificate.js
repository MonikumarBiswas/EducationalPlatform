const params = new URLSearchParams(window.location.search);
const userId = params.get("userId");
const courseId = params.get("courseId");

async function loadCertificate() {
  if (!userId || !courseId) {
    document.getElementById("errorMsg").textContent = "Missing user or course information.";
    document.getElementById("errorMsg").classList.remove("hidden");
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/certificate/${userId}/${courseId}`);
    const data = await res.json();

    if (data.message) {
      // Error from backend
      document.getElementById("errorMsg").textContent = "⚠️ " + data.message;
      document.getElementById("errorMsg").classList.remove("hidden");
      return;
    }

    // Populate certificate
    document.getElementById("certStudentName").textContent = data.studentName;
    document.getElementById("certCourseName").textContent = data.courseName;
    document.getElementById("certTeacher").textContent = `Instructed by: ${data.teacherName}`;
    document.getElementById("certDate").textContent = `Issued on: ${data.issuedDate}`;

    document.getElementById("certificateCard").classList.remove("hidden");
  } catch (err) {
    console.error(err);
    document.getElementById("errorMsg").textContent = "Failed to load certificate.";
    document.getElementById("errorMsg").classList.remove("hidden");
  }
}

loadCertificate();