import './topBar.css';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoginModal from '../../components/loginmodal/LoginModal';

export default function TopBar() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  }

  const openLoginModal = () => {
    console.log('show');
    setShowLoginModal(true);
  }

  return (
    <header className="topBar">
      <LoginModal show={showLoginModal} setShow={setShowLoginModal}  />

      <h1 className="topBarHeader">React &middot; Socket.io Real Time Chat Demo</h1>
      <div className="topBarButtonsContainer">
      {currentUser ? (
          <button onClick={handleLogout}
            className="logoutButton">Logout</button>
        ) : (
          <>
            <button onClick={openLoginModal} className="loginButton">Login</button>
            <button className="registerButton">Register</button>
          </>
        )
      }
      </div>
    </header>
  );
}

