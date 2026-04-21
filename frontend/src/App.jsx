import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalogo from './pages/Catalogo';
import MisInscripciones from './pages/MisInscripciones';
import AdminDashboard from './pages/AdminDashboard';
import AdminElectivas from './pages/AdminElectivas';
import AdminOfertas from './pages/AdminOfertas';
import AdminInscripciones from './pages/AdminInscripciones';
import { useAuth } from './context/AuthContext';

function Root() {
  const { isAuth, isAdmin } = useAuth();
  if (!isAuth) return <Navigate to="/login" replace />;
  return <Navigate to={isAdmin ? '/admin/dashboard' : '/cursos'} replace />;
}

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/cursos" element={<Catalogo />} />
          <Route path="/mis-inscripciones" element={<MisInscripciones />} />
        </Route>

        <Route element={<PrivateRoute adminOnly><Layout /></PrivateRoute>}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/electivas" element={<AdminElectivas />} />
          <Route path="/admin/ofertas" element={<AdminOfertas />} />
          <Route path="/admin/inscripciones" element={<AdminInscripciones />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  );
}
