const myQuestions = [
    {
      question: "Which animal is known as the King of the Jungle?",
      answers: {
        a: "Lion",
        b: "Tiger",
        c: "Elephant",
        d: "Giraffe"
      },
      correctAnswer: "a"
    },
    {
      question: "What is the largest planet in our solar system?",
      answers: {
        a: "Earth",
        b: "Jupiter",
        c: "Mars",
        d: "Saturn"
      },
      correctAnswer: "b"
    }
  ];
  
  function buildQuiz() {
    const quizContainer = document.getElementById('quiz');
    const output = [];
  
    myQuestions.forEach((currentQuestion, questionNumber) => {
      const answers = [];
      for (letter in currentQuestion.answers) {
        answers.push(
          `<label>
            <input type="radio" name="question${questionNumber}" value="${letter}">
            ${letter}: ${currentQuestion.answers[letter]}
          </label>`
        );
      }
      output.push(
        `<div class="question">${currentQuestion.question}</div>
         <div class="answers">${answers.join('')}</div>`
      );
    });
  
    quizContainer.innerHTML = output.join('');
  }
  
  function showResults() {
    const quizContainer = document.getElementById('quiz');
    const resultsContainer = document.getElementById('results');
    let numCorrect = 0;
  
    myQuestions.forEach((currentQuestion, questionNumber) => {
      const selector = `input[name=question${questionNumber}]:checked`;
      const userAnswer = (quizContainer.querySelector(selector) || {}).value;
      if (userAnswer === currentQuestion.correctAnswer) {
        numCorrect++;
      }
    });
  
    resultsContainer.innerHTML = `You got ${numCorrect} out of ${myQuestions.length} correct.`;
  }
  
  buildQuiz();
  
  document.getElementById('submit').addEventListener('click', showResults);
  