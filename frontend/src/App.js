import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useNavigation } from 'react-router-dom';
import './App.css'; // Make sure to create this CSS file


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
    const response = await fetch(
      'http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok){
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    setMessage(data.message || data.error);
    } catch (error) {
      console.error('Registration Error:', error);
      setMessage(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if(data.message === "Login successful"){
      navigate('/quiz');
    }
    setMessage(data.message || data.error);
    } catch (error) {
      console.error('Login Error:', error);
      setMessage(error.message);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
  const response = await fetch('http://localhost:5000/api/testdb');
  if (!response.ok) {
  throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();
  console.log('DB Connection Test:', data);
  } catch (error) {
  console.error('Connection test failed:', error);
  setMessage("Failed to connect to the database.");
  }
};


  return (
    <div className="main-container">
      <div className="login-container">
        <div className="form-container">
          <div className="logo-container">
            <div className="logo">✦</div>
          </div>
              
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <small>Must be at least 8 characters</small>
            </div>
            
            <button className="create-account-btn" onClick={handleRegister}>
              Create account
            </button>
            
            <button className="login-btn" onClick={handleLogin}>
              Login
            </button>
            
            <button className="test-db-btn" onClick={handleSubmit}>
              Test DB Connection
            </button>
          </form>
          
          <div className="login-link">
            Been here before? <a href="#" onClick={handleLogin}>Log in</a>
          </div>
          
          {message && <p className="message">{message}</p>}
        </div>
        
        <div className="visual-section">
          <div className="visual-content">
            <div className="decoration-circle"></div>
            <h2>Profile Creation / Sign In</h2>
            <p>Welcome to our platform</p>
          </div>
        </div>
      </div>
    </div>
  );
}


const quiz = [
  {
    category: "Recycling Habits",
    maxPoints: 9,
    questions: [
      {
        question: "How often do you recycle paper, plastic, and glass products?",
        answers: [
          { text: "Never", points: 0 },
          { text: "Sometimes", points: 1 },
          { text: "Often", points: 2 },
          { text: "Always", points: 3 }
        ]
      },
      {
        question: "When buying products, do you consider if the packaging is recyclable or minimal?",
        answers: [
          { text: "Never", points: 0 },
          { text: "Rarely", points: 1 },
          { text: "Sometimes", points: 2 },
          { text: "Yes, always", points: 3 }
        ]
      },
      {
        question: "What do you do with used batteries or electronics?",
        answers: [
          { text: "Throw them in the trash", points: 0 },
          { text: "Store them somewhere but not sure what to do", points: 1 },
          { text: "Occasionally take them to recycling centers", points: 2 },
          { text: "Always dispose of them at designated drop-off points", points: 3 }
        ]
      }
    ]
  },
  {
    category: "Water Conservation",
    maxPoints: 9,
    questions: [
      {
        question: "How long are your typical showers?",
        answers: [
          { text: "over 40 minutes", points: 0 },
          { text: "30-40 minutes", points: 1 },
          { text: "20-30 minutes", points: 2 },
          { text: "under 15 minutes", points: 3 }
        ]
      },
      {
        question: "Do you turn off the tap while brushing your teeth?",
        answers: [
          { text: "Never", points: 0 },
          { text: "Rarely", points: 1 },
          { text: "Most of the time", points: 2 },
          { text: "Always", points: 3 }
        ]
      },
      {
        question: "How often do you tend to accidentally leave your faucet/sink running?",
        answers: [
          { text: "Always", points: 0 },
          { text: "Often", points: 1 },
          { text: "Sometimes", points: 2 },
          { text: "Never", points: 3 }
        ]
      }
    ]
  },
  {
    category: "Energy Conservation",
    maxPoints: 9,
    questions: [
      {
        question: "How often do you turn off lights and electronics when not in use?",
        answers: [
          { text: "Never", points: 0 },
          { text: "Occasionally", points: 1 },
          { text: "Most of the time", points: 2 },
          { text: "Always", points: 3 }
        ]
      },
      {
        question: "What’s your usual habit regarding lights when leaving a room?",
        answers: [
          { text: "Leave them on", points: 0 },
          { text: "Only turn off if I’ll be gone for a while", points: 1 },
          { text: "Usually turn them off", points: 2 },
          { text: "Always turn them off right away", points: 3 }
        ]
      },
      {
        question: "Do you unplug devices or use power strips to reduce phantom energy use?",
        answers: [
          { text: "Never", points: 0 },
          { text: "Rarely", points: 1 },
          { text: "Sometimes", points: 2 },
          { text: "Yes, regularly", points: 3 }
        ]
      }
    ]
  },
  {
    category: "Waste Reduction",
    maxPoints: 9,
    questions: [
      {
        question: "When buying products, how much do you consider packaging waste?",
        answers: [
          { text: "I never think about it", points: 0 },
          { text: "Rarely, unless it's a lot of plastic", points: 1 },
          { text: "I try to choose minimal packaging", points: 2 },
          { text: "I prioritize products with recyclable or compostable packaging", points: 3 }
        ]
      },
      {
        question: "How often do you buy single-use items (e.g., plastic cutlery, paper towels, water bottles)?",
        answers: [
          { text: "Very often", points: 0 },
          { text: "Occasionally", points: 1 },
          { text: "Rarely", points: 2 },
          { text: "I avoid single-use items and use reusable alternatives", points: 3 }
        ]
      },
      {
        question: "When decluttering, what do you do with items you no longer need?",
        answers: [
          { text: "Throw them out", points: 0 },
          { text: "Only donate or sell if it’s easy", points: 1 },
          { text: "Donate or sell when possible", points: 2 },
          { text: "Always try to donate, sell, or repurpose items", points: 3 }
        ]
      }
    ]
  }
];

function QuizPage() {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleChange = (catIdx, qIdx, ansIdx) => {
    setAnswers({
      ...answers,
      [`${catIdx}-${qIdx}`]: ansIdx
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowResults(true);
  };

  const getCategoryScores = () => {
    return quiz.map((cat, catIdx) => {
      let score = 0;
      cat.questions.forEach((q, qIdx) => {
        const ansIdx = answers[`${catIdx}-${qIdx}`];
        if (ansIdx !== undefined) {
          score += q.answers[ansIdx].points;
        }
      });
      return { category: cat.category, score, max: cat.maxPoints };
    });
  };

  

  return (
    <div className="quiz-container">
      <h1>Eco-Friendly Habits Quiz</h1>
      <form onSubmit={handleSubmit}>
        {quiz.map((cat, catIdx) => (
          <div key={cat.category} className="category-block">
            <h2>{cat.category}</h2>
            {cat.questions.map((q, qIdx) => (
              <div key={q.question} className="question-block">
                <div className="question">{q.question}</div>
                <div className="answers">
                  {q.answers.map((ans, ansIdx) => (
                    <label key={ans.text}>
                      <input
                        type="radio"
                        name={`cat${catIdx}-q${qIdx}`}
                        value={ansIdx}
                        checked={answers[`${catIdx}-${qIdx}`] === ansIdx}
                        onChange={() => handleChange(catIdx, qIdx, ansIdx)}
                        disabled={showResults}
                      />
                      {ans.text} ({ans.points} pts)
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
        {!showResults && <button type="submit">Submit Quiz</button>}
      </form>
      {showResults && (
        <div className="results">
          <h2>Your Results</h2>
          <ul>
            {getCategoryScores().map((cat) => (
              <li key={cat.category}>
                <strong>{cat.category}:</strong> {cat.score} / {cat.max}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/quiz" element={<QuizPage />} />
      </Routes>
    </Router>
  );
}

export default App;
