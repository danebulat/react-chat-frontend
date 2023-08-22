import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './loginModal.css';

export default function LoginModal({ show, setShow }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  const { 
    login, 
    loginError, 
    loginErrorMsg } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(username.trim(), password.trim());
    setLoading(false);

    if (res) {
      setUsername('');
      setPassword('');
      setShow(false);
    }
  };

  const handleClose = (e) => {
    e.preventDefault()
    setUsername('');
    setPassword('');
    setShow(false);
  }

  return (
    <div className={ show ? "loginModal showModal" : "loginModal hideModal"} >
      <div className="loginModalOuter">
      <div className="loginModalInner">
        <form className="loginForm" onSubmit={handleSubmit}>
          <h1 className="loginTitle">Login</h1>
          {loginError && <span className="loginError">{loginErrorMsg}</span>}
          <input
            className="formInput"
            type="text"
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <input
            className="formInput"
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
            <button className="loginSubmitButton" type="submit"
                disabled={loading ? 1 : 0} >
              Login
            </button>
            <button className="loginCloseButton" onClick={handleClose}>
              Close
            </button>
        </form>

      </div>
      </div> 
    </div>
  );
}
