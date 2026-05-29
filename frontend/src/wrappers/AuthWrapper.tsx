import { Navigate, Outlet } from '@umijs/max';
import { isAuthenticated } from '@/services/api';

export default () => {
  // Check if user is authenticated via JWT token
  if (isAuthenticated()) {
    return <Outlet />;
  }

  // Not logged in -> redirect to Login
  return <Navigate to="/login" />;
};
