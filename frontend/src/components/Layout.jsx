import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">
            <Link to="/dashboard">Студенческий портал</Link>
          </h1>
          <nav className="nav">
            <Link to="/dashboard">Главная</Link>
            {user?.role === 'student' && (
              <>
                <Link to="/courses">Курсы</Link>
                <Link to="/schedule">Расписание</Link>
                <Link to="/assignments">Задания</Link>
                <Link to="/materials">Материалы</Link>
                <Link to="/grades">Оценки</Link>
              </>
            )}
            {user?.role === 'teacher' && (
              <>
                <Link to="/courses">Курсы</Link>
                <Link to="/schedule">Расписание</Link>
                <Link to="/assignments">Задания</Link>
                <Link to="/materials">Материалы</Link>
              </>
            )}
            <Link to="/profile">Профиль</Link>
            <button onClick={handleLogout} className="logout-btn">
              Выход
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;


