import { useEffect, useState } from 'react';
import { apiGet, apiPut } from '../api';

export default function GenerateProblem() {
  const [mode, setMode] = useState('random');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [question, setQuestion] = useState(null);
  const [topics, setTopics] = useState([]);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const loadQuestion = async () => {
    setError('');
    setResult(null);
    setAnswer('');
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('mode', mode);
      if (mode === 'topic' && topic) params.set('topic', topic);
      if (mode === 'difficulty' && difficulty) params.set('difficulty', difficulty);
      const data = await apiGet(`/api/questions?${params.toString()}`);
      setQuestion(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (e) => {
    e.preventDefault();
    if (!question?._id) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiPut('/api/questions/history', {
        questionId: question._id,
        userAnswer: answer,
      });
      setResult({ correct: data.correct, currentStreak: data.currentStreak });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial question load
    loadQuestion();
    // fetch topics
    apiGet('/api/questions/topics').then((data) => setTopics(data.topics || [])).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <h2 className="section-title">Generate Problem</h2>
      <div className="row" style={{ marginBottom: 16 }}>
        <label>
          <input type="radio" name="mode" value="random" checked={mode==='random'} onChange={() => setMode('random')} /> Random
        </label>
        <label>
          <input type="radio" name="mode" value="topic" checked={mode==='topic'} onChange={() => setMode('topic')} /> By Topic
        </label>
        <label>
          <input type="radio" name="mode" value="difficulty" checked={mode==='difficulty'} onChange={() => setMode('difficulty')} /> By Difficulty
        </label>
        <button className="btn btn-primary" onClick={loadQuestion} disabled={loading}>Generate</button>
      </div>
      {mode === 'topic' && (
        <div style={{ marginBottom: 12 }}>
          <label className="label">Topic</label>
          {topics.length > 0 ? (
            <select className="select" value={topic} onChange={(e)=>setTopic(e.target.value)}>
              <option value="">Select a topic</option>
              {topics.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          ) : (
            <input className="input" value={topic} onChange={(e)=>setTopic(e.target.value)} placeholder="Type a topic" />
          )}
        </div>
      )}
      {mode === 'difficulty' && (
        <div style={{ marginBottom: 12 }}>
          <label className="label">Difficulty</label>
          <input className="input" type="number" value={difficulty} onChange={(e)=>setDifficulty(e.target.value)} placeholder="e.g., 1" />
        </div>
      )}
      {error && <div style={{ color: 'var(--danger)', marginBottom: 12 }}>{error}</div>}
      {question && (
        <div className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div className="badge">{question.topic}</div>
            <div className="stat">Difficulty: {question.difficulty}</div>
          </div>
          <p style={{ fontSize: 18, marginTop: 12 }}>
            {String(question.question)}
          </p>
          <form onSubmit={submitAnswer} className="row">
            <input className="input" value={answer} onChange={(e)=>setAnswer(e.target.value)} placeholder="Your answer" />
            <button className="btn btn-primary" disabled={loading || !answer} type="submit">Submit</button>
          </form>
          {result && (
            <div style={{ marginTop: 12, color: result.correct ? 'var(--success)' : 'var(--danger)' }}>
              {result.correct ? 'Correct!' : 'Incorrect.'} Current streak: {result.currentStreak}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


