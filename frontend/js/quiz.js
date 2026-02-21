const params = new URLSearchParams(window.location.search);
const courseId = params.get("courseId");
const userID = localStorage.getItem("userID");

const loadMsg = document.getElementById("loadMsg");
const quizForm = document.getElementById("quizForm");
const questionsContainer = document.getElementById("questionsContainer");
const resultBox = document.getElementById("resultBox");

async function loadQuiz() {
  if (!courseId) {
    loadMsg.textContent = "No course specified.";
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/quiz/${courseId}`);
    const data = await res.json();

    if (!data.questions || data.questions.length === 0) {
      loadMsg.textContent = data.message || "No quiz available for this course.";
      return;
    }

    loadMsg.classList.add("hidden");
    quizForm.classList.remove("hidden");

    data.questions.forEach((q, i) => {
      const block = document.createElement("div");
      block.className = "bg-white rounded-xl shadow p-5 space-y-3";

      const optionLetters = ["A", "B", "C", "D"];
      const optionsHTML = q.options
        .map(
          (opt, j) => `
          <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition">
            <input type="radio" name="q${i}" value="${j}" class="accent-blue-600" required>
            <span class="font-medium text-gray-700">${optionLetters[j]}.</span>
            <span class="text-gray-700">${opt}</span>
          </label>`
        )
        .join("");

      block.innerHTML = `
        <h3 class="font-bold text-gray-800 text-lg">Q${i + 1}. ${q.question}</h3>
        <div class="space-y-2">${optionsHTML}</div>
      `;

      questionsContainer.appendChild(block);
    });
  } catch (err) {
    console.error(err);
    loadMsg.textContent = "Failed to load quiz. Please try again.";
  }
}

quizForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!userID) {
    alert("Please login first.");
    return;
  }

  // Collect selected answers
  const answers = [];
  for (let i = 0; i < 5; i++) {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (!selected) {
      alert(`Please answer question ${i + 1}.`);
      return;
    }
    answers.push(parseInt(selected.value));
  }

  try {
    const res = await fetch(`http://localhost:3000/quiz/${courseId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user-id": userID,
      },
      body: JSON.stringify({ answers }),
    });

    const data = await res.json();

    // Hide quiz, show result
    quizForm.classList.add("hidden");
    resultBox.classList.remove("hidden");

    const resultTitle = document.getElementById("resultTitle");
    const resultScore = document.getElementById("resultScore");
    const certLink = document.getElementById("certLink");
    const certAnchor = document.getElementById("certAnchor");

    if (data.passed) {
      resultTitle.textContent = "🎉 You Passed!";
      resultTitle.className = "text-3xl font-bold mb-3 text-green-600";
      certLink.classList.remove("hidden");
      certAnchor.href = `certificate.html?userId=${userID}&courseId=${courseId}`;
    } else {
      resultTitle.textContent = "❌ Not Passed";
      resultTitle.className = "text-3xl font-bold mb-3 text-red-500";
    }

    resultScore.textContent = data.message;
  } catch (err) {
    console.error(err);
    alert("Failed to submit quiz. Please try again.");
  }
});

loadQuiz();
