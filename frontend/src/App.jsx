import { useState } from "react";
import "./App.css";

function App() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function generatePlan(event) {
    event.preventDefault();

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:3000/api/generate-study-plan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ topic }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Request failed");
      }

      setResult(data.data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app">
      <header className="header">
        <div className="header-content">
          <p className="eyebrow">AI ENGINEERING LAB</p>
          <h1>SchemaGuard AI</h1>
          <p className="subtitle">
            Generate structured AI responses and validate them
            before your application accepts them.
          </p>
        </div>
      </header>

      <div className="layout">
        <section className="panel panel-main">
          <form onSubmit={generatePlan} className="form">
            <label htmlFor="topic" className="form-label">
              What do you want to learn?
            </label>

            <input
              id="topic"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="e.g. React, Python, machine learning"
              required
              minLength={2}
              className="form-input"
            />

            <button type="submit" disabled={loading} className="form-button">
              {loading ? "Generating..." : "Generate study plan"}
            </button>
          </form>

          {error && (
            <section className="error" role="alert">
              <h2>Request failed</h2>
              <p>{error}</p>
            </section>
          )}

          {result && (
            <section className="result">
              <div className="status">✓ Backend validation passed</div>

              <div className="result-header">
                <h2>{result.topic}</h2>
                <div className="meta">
                  <span className="meta-item">
                    <span className="meta-label">Level:</span>
                    <span className="meta-value">{result.level}</span>
                  </span>
                  <span className="meta-item">
                    <span className="meta-label">Duration:</span>
                    <span className="meta-value">{result.durationDays} days</span>
                  </span>
                </div>
              </div>

              <h3 className="section-title">Daily tasks</h3>
              <ul className="task-list">
                {result.dailyTasks.map((task, index) => (
                  <li key={index} className="task-item">
                    <span className="task-number">{index + 1}</span>
                    <span className="task-text">{task}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </section>

        <aside className="panel panel-json" aria-label="Validated JSON output">
          <div className="json-header">
            <h3 className="json-title">Validated JSON</h3>
            {result && (
              <button className="copy-button" onClick={() => copyJson(result)}>
                Copy JSON
              </button>
            )}
          </div>
          
          <div className="json-container">
            {result ? (
              <pre className="json-pre">{JSON.stringify(result, null, 2)}</pre>
            ) : (
              <div className="json-placeholder">
                <svg className="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <p>JSON output will appear here</p>
                <span>Generate a study plan to see the validated schema</span>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}

function copyJson(data) {
  navigator.clipboard.writeText(JSON.stringify(data, null, 2));
}

export default App;