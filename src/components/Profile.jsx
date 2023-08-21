import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import jwt_decode from 'jwt-decode';


export function Profile() {
  const [loading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const auth = useAuth(); 

  useEffect(() => {
    const lsCurrentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!lsCurrentUser)    navigate('/');
    if (!auth.currentUser) auth.setCurrentUser(lsCurrentUser);

    setIsLoading(false);
  }, []);

  const handleDelete = async () => {
    const conf = confirm('Are you sure?');
    if (!conf) return;

    const { id } = jwt_decode(auth.currentUser.accessToken);
    await auth.deleteUser(id);
    navigate('/');
  };

  const handleLogout = async () => {
    await auth.logout();
    navigate('/');
  };

  if (loading) {
    return <div className="inner-grid">Loading...</div>
  } else {
    return (
      <div className="profile-grid">
        <div className="home">
          <span>
            Welcome to the <b>{auth.currentUser.isAdmin ? "admin" : "user"}</b> dashboard{" "}
            <b>{auth.currentUser.username}</b>.
          </span>
          <button className="deleteButton" onClick={() => handleDelete()}>
            Delete Account 
          </button>
          <button className="submitButton" onClick={() => handleLogout()}>
            Logout
          </button>
          {auth.error && (
            <span className="error">
              You are not allowed to delete this user!
            </span>
          )}
          {auth.success && (
            <span className="success">
              User has been deleted successfully...
            </span>
          )}
        </div>
      </div>
    );
  }
}

