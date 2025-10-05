import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthed = !!localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true, state: { from: location } });
  };

  return (
    <nav className="nav">
      {!isAuthed ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      ) : (
        <>
          <Link to="/generate">Problem</Link>
          <Link to="/profile">Profile</Link>
          <span className="spacer" />
          <button className="btn btn-danger" onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  );
}


