import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, ClipboardList, LayoutDashboard, Library, CalendarDays, Users, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const studentNav = [
    { to: '/cursos', label: 'Catálogo', icon: BookOpen },
    { to: '/mis-inscripciones', label: 'Mis inscripciones', icon: ClipboardList }
  ];
  const adminNav = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/electivas', label: 'Electivas', icon: Library },
    { to: '/admin/ofertas', label: 'Ofertas', icon: CalendarDays },
    { to: '/admin/inscripciones', label: 'Inscripciones', icon: Users }
  ];
  const nav = isAdmin ? adminNav : studentNav;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 bg-white border-r border-neutral-200 flex flex-col">
        <div className="px-5 py-5 border-b border-neutral-200 flex items-center gap-2">
          <div className="p-1.5 bg-primary rounded-lg">
            <GraduationCap className="text-white" size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-900">Electivas CUL</p>
            <p className="text-[11px] text-neutral-600">{isAdmin ? 'Admin' : 'Estudiante'}</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-neutral-600 hover:bg-neutral-100'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-neutral-200">
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-neutral-900 truncate">{user?.nombre}</p>
            <p className="text-xs text-neutral-600 truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-neutral-600 hover:bg-neutral-100">
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
