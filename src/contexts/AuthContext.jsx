import React, { useContext, useState, useEffect } from "react";
import axios           from 'axios';
import jwt_decode      from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import { serverUri}    from '../config/server.js';

// The context object
const AuthContext = React.createContext();

// Return context value
export function useAuth() {
  return useContext(AuthContext);
}

// Application top-level component
export function AuthProvider({ children }) {

  const [currentUser,      setCurrentUser]      = useState(null);
  const [loginError,       setLoginError]       = useState(false);
  const [loginErrorMsg,    setLoginErrorMsg]    = useState('');
  const [registerError,    setRegisterError]    = useState(false);
  const [registerErrorMsg, setRegisterErrorMsg] = useState('');

  const navigate = useNavigate();

  // Axios instance that requires the interceptor 
  // before every request
  const axiosJWT = axios.create();

  /* -------------------------------------------------- */
  /* Refresh token                                      */
  /* -------------------------------------------------- */

  async function refreshToken() {
    try {
      const res = await axios.post(`${serverUri}/api/refresh`,
        { token: currentUser.refreshToken });

      setCurrentUser({
        ...currentUser,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });
    }
    catch (err) {
      console.log(err);

      // No longer authenticated
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
      navigate('/');
    }
  }

  // check refresh token before every request
  axiosJWT.interceptors.request.use(
    async (config) => {
      let currentDate = new Date();
      const decodedToken = jwt_decode(currentUser.accessToken);
  
      // generate new tokens if access token expired
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        await refreshToken();
        config.headers["authorization"] = "Bearer " + currentUser.accessToken;
      }
  
      // return updated config for the request
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  /* -------------------------------------------------- */
  /* Handlers                                           */
  /* -------------------------------------------------- */

  async function register(username, password, setUsers) {
    if (!username || !password) {
      setRegisterError(true);
      setRegisterErrorMsg('Provide a username and password');
      return;
    }

    try {
      const res = await axios.post(`${serverUri}/api/register`, {
        username, password
      });

      setCurrentUser({ ...res.data });
      setRegisterError(false);

      localStorage.setItem('currentUser', JSON.stringify({ ...res.data }));
      setUsers(prev => [...prev, { ...res.data }]);
      navigate('/profile');
    }
    catch (err) {
      console.log(err);
      setRegisterError(true);
      setRegisterErrorMsg(err.response.data.error);
    }
  }

  async function login(username, password) {
    if (!username.trim() || !password.trim()) {
      setLoginError(true);
      setLoginErrorMsg('Provide a username and password');
      return;
    }

    try {
      const res = await axios.post(`${serverUri}/api/login`, { 
        username, password 
      });

      setCurrentUser({ ...res.data });
      setLoginError(false);

      localStorage.setItem('currentUser', JSON.stringify({ ...res.data }));
      navigate('/profile');
    }
    catch (err) {
      console.log(err);
      setLoginError(true);
      setLoginErrorMsg(err.response.data.error);
    }
  }

  async function logout() {
    const accessToken = currentUser.accessToken;

    await axiosJWT.post(
      `${serverUri}/api/logout`,
      { token: currentUser.refreshToken },
      { headers: { authorization: "Bearer " + accessToken }},
    );

    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  }

  async function deleteUser(id) {
    try {
      await axiosJWT.delete(`${serverUri}/api/users/${id}`, {
        headers: { authorization: "Bearer " + currentUser.accessToken }
      });
      
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
    }
    catch (err) {
      console.log(err);
    }
  }

  const value = {
    currentUser,
    setCurrentUser,
    login,
    logout,
    deleteUser,
    register,

    loginError,
    loginErrorMsg,
    registerError,
    registerErrorMsg,
  };

  // Provide context value
  return (
    <AuthContext.Provider value={value}>
      { children }
    </AuthContext.Provider>
  );
};
