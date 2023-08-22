import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext.jsx';

export default function RequireAuth({ children }) {
  let location = useLocation();
  let { currentUser } = useAuth();

  //runs on page refresh, check if user is in local storage
  if (!currentUser) {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) {
      //no user in local storage
      return <Navigate to="/" state={{ from: location }} replace />;
    }
    else {
      //user found in local storage
      return children;
    }
  } else {
    //user set in auth context
    return children;
  }
}
