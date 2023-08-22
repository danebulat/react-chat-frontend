import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './registerModal.css';

export default function RegisterModal({ show, setShow }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  const { 
    register, 
    registerError, 
    registerErrorMsg } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await register(username.trim(), password.trim()); 
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
    <div className={ show ? "registerModal showModal" : "registerModal hideModal"} >
      <div className="registerModalInner">
        <form className="registerForm" onSubmit={handleSubmit}>
          <h1 className="registerTitle">Register</h1>
          {registerError && <span className="registerError">{registerErrorMsg}</span>}
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
            <button className="registerSubmitButton" type="submit"
                disabled={loading ? 1 : 0} >
              Register 
            </button>
            <button className="registerCloseButton" onClick={handleClose}>
              Close
            </button>
        </form>

      </div> 
    </div>
  );
}

