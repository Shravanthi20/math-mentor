import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api';

export default function AddQuestion() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('1');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet('/api/questions/topics').then((d)=> setTopics(d.topics||[])).catch(()=>{});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const created = await apiPost('/api/questions', { question, answer, topic, difficulty: Number(difficulty) });
      setMessage('Question added');
      setQuestion('');
      setAnswer('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="section-title">Add Question</h2>
      <form className="card" onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label className="label">Question</label>
          <input className="input" value={question} onChange={(e)=>setQuestion(e.target.value)} required />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label className="label">Answer</label>
          <input className="input" value={answer} onChange={(e)=>setAnswer(e.target.value)} required />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label className="label">Topic</label>
          {topics.length ? (
            <select className="select" value={topic} onChange={(e)=>setTopic(e.target.value)}>
              <option value="">Select topic</option>
              {topics.map((t)=> <option key={t} value={t}>{t}</option>)}
            </select>
          ) : (
            <input className="input" value={topic} onChange={(e)=>setTopic(e.target.value)} placeholder="Type a topic" />
          )}
        </div>
        <div style={{ marginBottom: 12 }}>
          <label className="label">Difficulty</label>
          <input className="input" type="number" min="1" max="5" value={difficulty} onChange={(e)=>setDifficulty(e.target.value)} required />
        </div>
        {error && <div style={{ color: 'var(--danger)', marginBottom: 12 }}>{error}</div>}
        {message && <div style={{ color: 'var(--success)', marginBottom: 12 }}>{message}</div>}
        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? 'Saving...' : 'Add Question'}
        </button>
      </form>
    </div>
  );
}


