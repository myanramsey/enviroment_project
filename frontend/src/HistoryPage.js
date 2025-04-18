import React, { useState, useEffect } from 'react'; //fixed
import { useNavigate } from 'react-router-dom';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
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

  return (
    <div className="history-container">
      <div className="history-header">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
        <button onClick={() => navigate('/quiz')} className="back-btn">
          Back to Quiz
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {history.length > 0 ? (
        history.map((entry, idx) => (
          <div key={idx} className="history-entry">
            <h3>
              Attempt on {new Date(entry.timestamp).toLocaleString()}
            </h3>
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
  );
}