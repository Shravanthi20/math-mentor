import { useEffect, useMemo, useState } from 'react';
import { apiGet } from '../api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [historyData, setHistoryData] = useState({ history: [], scores: {} });

  useEffect(() => {
    const load = async () => {
      setError('');
      setLoading(true);
      try {
        const p = await apiGet('/api/users/profile');
        const h = await apiGet('/api/questions/history');
        setProfile(p);
        setHistoryData(h);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const correct = profile?.correctCount || 0;
  const total = profile?.totalAnswered || 0;
  const accuracy = total ? Math.round((correct / total) * 100) : 0;

  const incorrect = Math.max(total - correct, 0);

  const chartData = useMemo(() => ({
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        label: 'Count',
        data: [correct, incorrect],
        backgroundColor: ['#20c997', '#ff5d5d'],
        borderColor: ['#0fa57b', '#ff3b3b'],
        borderWidth: 1,
        borderRadius: 8,
      }
    ]
  }), [correct, incorrect]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { stepSize: 1 } }
    }
  }), []);

  return (
    <div className="container">
      {loading ? (
        <>Loading...</>
      ) : error ? (
        <div style={{ color: 'var(--danger)' }}>{error}</div>
      ) : (
        <>
          <h2 className="section-title">Profile</h2>
          <div className="row" style={{ gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
            <div className="stat"><strong>Name:</strong> {profile?.name}</div>
            <div className="stat"><strong>Email:</strong> {profile?.email}</div>
            <div className="stat"><strong>Current streak:</strong> {profile?.currentStreak || 0}</div>
            <div className="stat"><strong>Max streak:</strong> {profile?.maxStreak || 0}</div>
            <div className="stat"><strong>Accuracy:</strong> {accuracy}%</div>
          </div>
          <h3 className="section-title">Performance</h3>
          <div className="card" style={{ marginBottom: 16 }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
          <h3 className="section-title">Scores by Topic</h3>
          <div className="card">
            {Object.entries(historyData.scores || {}).map(([t, s]) => (
              <div key={t} className="row" style={{ justifyContent: 'space-between', borderBottom: '1px solid var(--border)', padding: '6px 0' }}>
                <span className="badge">{t}</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
          <h3 className="section-title">History</h3>
          <div className="card">
            {historyData.history?.slice().reverse().map((h, idx) => (
              <div key={idx} className="row" style={{ gap: 12, alignItems: 'center', borderBottom: '1px solid var(--border)', padding: '8px 0' }}>
                <span style={{ width: 100, color: h.correct ? 'var(--success)' : 'var(--danger)' }}>{h.correct ? 'Correct' : 'Incorrect'}</span>
                <span style={{ width: 140 }}><strong>Topic:</strong> {h.topic}</span>
                <span style={{ width: 180 }}><strong>Problem:</strong> {String(h.problem)}</span>
                <span><strong>Your answer:</strong> {String(h.userAnswer)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}


