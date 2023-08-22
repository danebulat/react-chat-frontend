import './topBar.css';
import { useAuth } from '../../contexts/AuthContext';

export default function TopBar() {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="topBar">
      <h1 className="topBarHeader">React &middot; Socket.io Real Time Chat Demo</h1>
      <div className="topBarButtonsContainer">
      {currentUser ? (
          <button onClick={handleLogout}
            className="logoutButton">Logout</button>
        ) : (
          <>
            <button className="loginButton">Login</button>
            <button className="registerButton">Register</button>
          </>
        )
      }
      </div>
    </header>
  );
}

