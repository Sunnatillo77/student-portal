import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { gradesAPI } from '../services/api';
import './Grades.css';

const Grades = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [gradesRes, performanceRes] = await Promise.all([
        gradesAPI.getAll(),
        gradesAPI.getPerformance(),
      ]);
      setGrades(gradesRes.data);
      setPerformance(performanceRes.data);
    } catch (error) {
      console.error('Ошибка загрузки оценок:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Загрузка оценок...</div>;
  }

  return (
    <div className="grades">
      <h1>Оценки</h1>

      {performance && (
        <div className="performance-card">
          <h2>Успеваемость</h2>
          <div className="performance-stats">
            <div className="stat-item">
              <span className="stat-label">Средний балл:</span>
              <span className="stat-value">{performance.overallAverage}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Всего оценок:</span>
              <span className="stat-value">{performance.totalGrades}</span>
            </div>
          </div>
        </div>
      )}

      <div className="grades-list">
        <h2>Все оценки</h2>
        {grades.length === 0 ? (
          <p>Нет оценок</p>
        ) : (
          <div className="grades-table">
            <div className="grades-header">
              <div>Курс</div>
              <div>Оценка</div>
              <div>Макс. балл</div>
              <div>Дата</div>
              {grades[0]?.feedback && <div>Комментарий</div>}
            </div>
            {grades.map((grade) => (
              <div key={grade.id} className="grade-row">
                <div>{grade.course?.name}</div>
                <div className="grade-score">{grade.score}</div>
                <div>{grade.max_score}</div>
                <div>{new Date(grade.graded_at).toLocaleDateString('ru-RU')}</div>
                {grade.feedback && <div className="grade-feedback">{grade.feedback}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Grades;


