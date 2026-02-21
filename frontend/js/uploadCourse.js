// Build 5 quiz question blocks dynamically
const quizContainer = document.getElementById("quizQuestions");

for (let i = 0; i < 5; i++) {
  const block = document.createElement("div");
  block.className = "bg-gray-50 border rounded-xl p-4 space-y-3";
  block.innerHTML = `
    <p class="font-semibold text-gray-700">Question ${i + 1}</p>
    <input type="text" class="q-text w-full border rounded-lg px-3 py-2" placeholder="Enter question" required>
    <div class="grid grid-cols-2 gap-2">
      <input type="text" class="opt w-full border rounded-lg px-3 py-2" placeholder="Option A" required>
      <input type="text" class="opt w-full border rounded-lg px-3 py-2" placeholder="Option B" required>
      <input type="text" class="opt w-full border rounded-lg px-3 py-2" placeholder="Option C" required>
      <input type="text" class="opt w-full border rounded-lg px-3 py-2" placeholder="Option D" required>
    </div>
    <div>
      <label class="text-sm text-gray-600 font-medium">Correct Answer:</label>
      <select class="correct-ans border rounded-lg px-3 py-2 ml-2">
        <option value="0">Option A</option>
        <option value="1">Option B</option>
        <option value="2">Option C</option>
        <option value="3">Option D</option>
      </select>
    </div>
  `;
  quizContainer.appendChild(block);
}

// Form submit
const courseForm = document.getElementById("courseForm");

courseForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userID = localStorage.getItem("userID");
  if (!userID) {
    alert("Please login first");
    return;
  }

  // Build quiz array from question blocks
  const blocks = quizContainer.querySelectorAll("div.bg-gray-50");
  const quizQuestions = [];

  let valid = true;
  blocks.forEach((block) => {
    const questionText = block.querySelector(".q-text").value.trim();
    const opts = [...block.querySelectorAll(".opt")].map((o) => o.value.trim());
    const answer = parseInt(block.querySelector(".correct-ans").value);

    if (!questionText || opts.some((o) => !o)) {
      valid = false;
    }

    quizQuestions.push({ question: questionText, options: opts, answer });
  });

  if (!valid) {
    alert("Please fill in all quiz questions and options.");
    return;
  }

  // Build FormData (multipart for image upload)
  const formData = new FormData();
  formData.append("title", courseForm.title.value);
  formData.append("description", courseForm.description.value);
  formData.append("price", courseForm.price.value);
  formData.append("videoLink", courseForm.videoLink.value);
  formData.append("materials", courseForm.materials.value);
  formData.append("quiz", JSON.stringify(quizQuestions));

  const thumbnailFile = courseForm.thumbnail.files[0];
  if (thumbnailFile) {
    formData.append("thumbnail", thumbnailFile);
  }

  try {
    const res = await fetch("http://localhost:3000/upload", {
      method: "POST",
      headers: { "user-id": userID },
      body: formData,
    });

    const result = await res.json();
    console.log(result);
    alert(result.message || "Upload complete!");

    if (result.message === "Course uploaded successfully.") {
      courseForm.reset();
      // Re-render quiz blocks
      quizContainer.innerHTML = "";
      location.reload();
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
});

document.getElementById("backbtn").addEventListener("click", () => {
  window.location.href = "teadashboard.html";
});