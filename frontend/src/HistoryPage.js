import React, { useState, useEffect } from 'react'; //fixed
import { useNavigate } from 'react-router-dom';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [habits, setHabits] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include'
    });
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const loadHistory = async () => {
    setError('');
    try {
      const res = await fetch('/api/quiz_history', {
        method: 'GET',
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `Error ${res.status}`);
      } else {
        setHistory(data);
      }
    } catch {
      setError('Network error');
    }
  };

  useEffect(() => {//to automatically refresh
    loadHistory();
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      const categoryMap = {};
      history.forEach(entry => {
        entry.results.forEach(cat => {
          if (!categoryMap[cat.category]) categoryMap[cat.category] = [];
          categoryMap[cat.category].push(cat.score);
        });
      });
      setHabits(categoryMap);

      const latest = history[0].results;
      const recs = latest.map(cat => {
        const pct = cat.score / cat.max;
        let text = '';
        if (pct < 0.5) {
          text = `Your ${cat.category.toLowerCase()} habit needs improvement! Try setting reminders!`;
        } else if (pct < 0.8) {
          text = `Good job on ${cat.category.toLowerCase()}! You can push further by tracking progress daily and sharing tips with friends!`;
        } else {
          text = `Excellent ${cat.category.toLowerCase()} habits! Keep it up and consider helping others adopt these practices!`;
        }
        return { category: cat.category, text };
      });
      setRecommendations(recs);
    }
  }, [history]);

  return (
    <div className="history-container">
      <div className="history-header">
        <button onClick={handleLogout} className="btn-blue">
          Logout
        </button>
        <button onClick={() => navigate('/quiz')} className="btn-blue">
          Back to Quiz
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="history-columns">
        {/* LEFT: Quiz History */}
        <div className="history-column">
          <h2>Quiz History</h2>
          {history.length > 0 ? (
            history.map((entry, idx) => (
              <div key={idx} className="history-entry">
                <h3>Attempt on {new Date(entry.timestamp).toLocaleString()}</h3>
                <ul>
                  {entry.results.map((cat) => (
                    <li key={cat.category}>
                      <strong>{cat.category}:</strong> {cat.score} / {cat.max}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>No history available.</p>
          )}
        </div>

        {/* MIDDLE: Habit Tracker */}
        <div className="habit-column">
          <h2>Habit Tracker</h2>
          {Object.entries(habits).map(([category, scores]) => (
            <div key={category} className="habit-item">
              <strong>{category}:</strong> {scores.join(', ')}
            </div>
          ))}
        </div>

        {/* RIGHT: Recommendations */}
        <div className="recommendation-column">
          <h2>Recommendations</h2>
          {recommendations.map(rec => (
            <div key={rec.category} className="recommendation-item">
              <strong>{rec.category}:</strong> {rec.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}