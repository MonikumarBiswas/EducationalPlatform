const courseForm = document.getElementById("courseForm");

courseForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userID = localStorage.getItem("userID");
  if (!userID) {
    alert("Please login first");
    return;
  }
   const formData = new FormData(courseForm);
   const data = Object.fromEntries(formData.entries());

  

  try {
   
      const res = await fetch("http://localhost:3000/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": userID
        },
        body: JSON.stringify(data)
      });

    const result = await res.json();
    console.log(result) ; 

    if (!res.ok) {
      alert(result.message || "Upload failed");
      return;
    }

    alert("Course uploaded successfully!");
    courseForm.reset();

  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
});
 

document.getElementById("backbtn").addEventListener("click", () => {
  window.location.href = "teadashboard.html";
});