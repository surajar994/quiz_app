let allQuestions = [];
let selectedQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 20;
let userAnswers = [];

const questionBox = document.getElementById("question-box");
const optionsBox = document.getElementById("options-box");
const skipBtn = document.getElementById("skip-btn");
const timerBox = document.getElementById("timer");

async function loadQuestions() {
    const response = await fetch("questions.json");
    allQuestions = await response.json();
    selectedQuestions = shuffle(allQuestions).slice(0, 10);
    showQuestion();
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function showQuestion() {
    clearInterval(timer);
    timeLeft = 60;
    timerBox.textContent = timeLeft;
    startTimer();

    const current = selectedQuestions[currentQuestionIndex];
    questionBox.innerHTML = `<h2>Q${currentQuestionIndex + 1}: ${current.question}</h2>`;
    optionsBox.innerHTML = "";

    current.options.forEach((opt) => {
        const button = document.createElement("button");
        button.textContent = opt;
        button.classList.add("option-btn");
        button.onclick = () => checkAnswer(opt, button);
        optionsBox.appendChild(button);
    });
}

function checkAnswer(selected, button) {
    disableOptions();

    const correct = selectedQuestions[currentQuestionIndex].answer;
    if (selected === correct) {
        button.classList.add("correct");
        score++;
    } else {
        button.classList.add("wrong");
        highlightCorrect(correct);
    }

    userAnswers.push({
        question: selectedQuestions[currentQuestionIndex].question,
        selected,
        correct,
    });

    setTimeout(nextQuestion, 1000);
}

function highlightCorrect(correct) {
    const buttons = document.querySelectorAll(".option-btn");
    buttons.forEach((btn) => {
        if (btn.textContent === correct) {
            btn.classList.add("correct");
        }
    });
}

function disableOptions() {
    const buttons = document.querySelectorAll(".option-btn");
    buttons.forEach((btn) => (btn.disabled = true));
}

function nextQuestion() {
    clearInterval(timer);
    currentQuestionIndex++;
    if (currentQuestionIndex < 10) {
        showQuestion();
    } else {
        showResult();
    }
}

function skipQuestion() {
    const current = selectedQuestions[currentQuestionIndex];
    userAnswers.push({
        question: current.question,
        selected: "Skipped",
        correct: current.answer,
    });
    nextQuestion();
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerBox.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            skipQuestion();
        }
    }, 1000);
}

function showResult() {
    optionsBox.style.display = "inline-block";
    optionsBox.style.width = '100%';
    questionBox.style.width = '100%';
    timerBox.remove();
    questionBox.innerHTML = `<h2>Quiz Finished!</h2><p>Your Score: ${score}/10</p>`;
    optionsBox.innerHTML = '<h3>Review of Incorrect or Skipped Questions</h3>  <div class="review-scroll">    <div class="review-grid"></div>  </div>';

    const reviewGrid = document.querySelector(".review-grid");
    const wrongAnswers = userAnswers.filter(q => q.selected !== q.correct);

    if (wrongAnswers.length === 0) {
        optionsBox.innerHTML += "<p>✅ Perfect score! No wrong answers.</p>";
    } else {

        wrongAnswers.forEach((q, i) => {
            const review = document.createElement("div");
            review.classList.add("review-item");
            review.innerHTML = `
          <p><strong>Q:</strong> ${q.question}</p>
          <p><strong>✔ Correct:</strong> ${q.correct}</p>
          <p><strong>❌ Your Answer:</strong> ${q.selected}</p>
        `;
            reviewGrid.appendChild(review);
        });
    }

    skipBtn.style.display = "none";
    const restartBtn = document.createElement("button");
    restartBtn.textContent = "Restart Quiz";
    restartBtn.className = "restart-btn";
    restartBtn.onclick = () => location.reload()
    controls.appendChild(restartBtn);
}


skipBtn.onclick = skipQuestion;

window.onload = loadQuestions;
