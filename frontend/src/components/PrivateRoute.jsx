import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, adminOnly }) {
  const { isAuth, isAdmin } = useAuth();
  if (!isAuth) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/cursos" replace />;
  return children;
}
