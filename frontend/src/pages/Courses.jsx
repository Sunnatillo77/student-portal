import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { coursesAPI } from '../services/api';
import './Courses.css';

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: '',
    credits: 3,
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await coursesAPI.getMy();
      setCourses(response.data);
    } catch (error) {
      setError('Ошибка загрузки курсов');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await coursesAPI.create(formData);
      setShowCreateForm(false);
      setFormData({ name: '', description: '', code: '', credits: 3 });
      loadCourses();
    } catch (error) {
      setError(error.response?.data?.error || 'Ошибка создания курса');
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await coursesAPI.enroll(courseId);
      loadCourses();
    } catch (error) {
      setError(error.response?.data?.error || 'Ошибка записи на курс');
    }
  };

  if (loading) {
    return <div className="loading">Загрузка курсов...</div>;
  }

  return (
    <div className="courses">
      <div className="courses-header">
        <h1>Курсы</h1>
        {user?.role === 'teacher' && (
          <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn-primary">
            {showCreateForm ? 'Отмена' : 'Создать курс'}
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showCreateForm && (
        <form onSubmit={handleCreateCourse} className="create-course-form">
          <h2>Создать новый курс</h2>
          <div className="form-group">
            <label>Название:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Код курса:</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Описание:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Кредиты:</label>
            <input
              type="number"
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
              min="1"
              max="10"
            />
          </div>
          <button type="submit" className="btn-primary">Создать</button>
        </form>
      )}

      <div className="courses-grid">
        {courses.length === 0 ? (
          <p>Нет доступных курсов</p>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="course-card">
              <h3>{course.name}</h3>
              <p className="course-code">Код: {course.code}</p>
              {course.description && <p className="course-description">{course.description}</p>}
              <div className="course-footer">
                <span className="course-credits">{course.credits} кредитов</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Courses;


