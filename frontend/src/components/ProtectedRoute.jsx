import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, adminOnly }) {
  const { currentUser, isAdmin, userData, loading } = useAuth();
  const location = useLocation();

  // Wait for auth + user data to resolve before making a decision
  if (loading) return null;

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Anyone who hasn't explicitly accepted the terms is blocked from all
  // protected routes and sent to the terms gate, regardless of account age.
  // We only skip this check if userData hasn't loaded yet (null) to avoid a
  // flash-redirect while Firestore is still fetching the profile.
  if (userData !== null && userData?.termsAccepted !== true) {
    return <Navigate to="/terms-gate" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
