import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { coursesAPI, assignmentsAPI, scheduleAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    courses: 0,
    assignments: 0,
    scheduleItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesRes, assignmentsRes, scheduleRes] = await Promise.all([
          coursesAPI.getMy(),
          assignmentsAPI.getMy(),
          scheduleAPI.getAll(),
        ]);

        setStats({
          courses: coursesRes.data.length,
          assignments: assignmentsRes.data.length,
          scheduleItems: scheduleRes.data.length,
        });
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  if (loading) {
    return <div className="dashboard-loading">Загрузка...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Добро пожаловать, {user?.full_name}!</h1>
      <p className="dashboard-subtitle">
        {user?.role === 'student' ? 'Панель студента' : 'Панель преподавателя'}
      </p>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Курсы</h3>
          <p className="stat-number">{stats.courses}</p>
        </div>
        <div className="stat-card">
          <h3>Задания</h3>
          <p className="stat-number">{stats.assignments}</p>
        </div>
        <div className="stat-card">
          <h3>Расписание</h3>
          <p className="stat-number">{stats.scheduleItems}</p>
        </div>
      </div>

      <div className="dashboard-info">
        <h2>Информация</h2>
        <div className="info-card">
          <p><strong>Email:</strong> {user?.email}</p>
          {user?.role === 'student' && user?.group_name && (
            <p><strong>Группа:</strong> {user.group_name}</p>
          )}
          <p><strong>Роль:</strong> {user?.role === 'student' ? 'Студент' : 'Преподаватель'}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


