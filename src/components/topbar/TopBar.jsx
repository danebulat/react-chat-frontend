import './topBar.css';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoginModal from '../../components/loginmodal/LoginModal';
import RegisterModal from '../registermodal/RegisterModal';

export default function TopBar() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  }

  const openLoginModal = () => {
    setShowLoginModal(true);
  }

  const openRegisterModal = () => {
    setShowRegisterModal(true);
  }

  return (
    <header className="topBar">
      <LoginModal show={showLoginModal} setShow={setShowLoginModal}  />
      <RegisterModal show={showRegisterModal} setShow={setShowRegisterModal}  />

      <h1 className="topBarHeader">React &middot; Socket.io Real Time Chat Demo</h1>
      <div className="topBarButtonsContainer">
      {currentUser ? (
          <button onClick={handleLogout}
            className="logoutButton">Logout</button>
        ) : (
          <>
            <button onClick={openLoginModal} className="loginButton">Login</button>
            <button onClick={openRegisterModal} className="registerButton">Register</button>
          </>
        )
      }
      </div>
    </header>
  );
}

