import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth }     from '../contexts/AuthContext';
import { serverUri }   from '../config/server.js';
import { timestampToDate, getSubString } from '../utils.js';
import axios from 'axios';

export function Login() {

  const [users, setUsers]       = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  const navigate = useNavigate();

  const { 
    login, 
    register, 
    setCurrentUser, 
    loginError, 
    loginErrorMsg,
    registerError, 
    registerErrorMsg } = useAuth();

  //navigate to profile if user saved in local storage
  useEffect(() => {
    const lsCurrentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (lsCurrentUser) {
      setCurrentUser(lsCurrentUser);
      navigate('/profile');
    }
  }, []);

  //load registered users
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const result = await axios.get(`${serverUri}/api/users`);
        setUsers(result.data);
      }
      catch (err) {
        console.log(err);
      }
    };
    getAllUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(username.trim(), password.trim());
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    await register(username.trim(), password.trim(), setUsers); 
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="outer-grid">
        <div className="page-left">
          <span className="leftTitle">Registered Users</span>
          <span className="leftSubTitle">{users.length} total &nbsp;&#183; 100 max</span>
          <ul className="users-ul">
            {users.map(user => (
              <li key={user.username}>
                <span className="username">{getSubString(user.username, 10)}</span>
                <span className="sub-txt">
                  joined {timestampToDate(user.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="page-right">
          <div className="inner-grid">
            <div className="login">
              <form onSubmit={handleSubmit}>
                <span className="formTitle">Login</span>
                {loginError && <span className="error">{loginErrorMsg}</span>}
                <input
                  type="text"
                  placeholder="username"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {loading
                  ? <button disabled type="submit" className="submitButton">Login</button>
                  : <button type="submit" className="submitButton">Login</button>}
              </form>
            </div>

            <div className="login">
              <form onSubmit={handleRegister}>
                <span className="formTitle">Register</span>
                {registerError && <span className="error">{registerErrorMsg}</span>}
                <input
                  type="text"
                  placeholder="username"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {loading 
                  ? <button disabled type="submit" className="submitButton">Register</button>
                  : <button type="submit" className="submitButton">Register</button>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
