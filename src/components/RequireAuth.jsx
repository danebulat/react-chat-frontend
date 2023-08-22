import { useEffect, useRef } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RequireAuth({ children }) {
  let { currentUser, setCurrentUser } = useAuth();
  let location = useLocation();
  let user = useRef(null);

  //check user in local storage
  useEffect(() => {
    if (!currentUser) {
      const storedUser = JSON.parse(localStorage.getItem('currentUser'));

      if (storedUser !== null) {
        setCurrentUser(storedUser);
        user.current = storedUser;
      }
    } else {
      user.current = currentUser;
    }
  }, []);

  //console.log(user.current);

  //redirect if user not logged in
  if (!user) {
    return <Navigate to="/" state={{from: location}} replace />;
  } else {
    return children;
  }
}

