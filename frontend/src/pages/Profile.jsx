import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    group_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        group_name: user.group_name || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await profileAPI.updateProfile(formData);
      updateUser(response.data);
      setMessage('Профиль успешно обновлен');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Ошибка обновления профиля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile">
      <h1>Профиль</h1>

      <div className="profile-content">
        <div className="profile-info">
          <h2>Информация о пользователе</h2>
          <div className="info-item">
            <strong>Email:</strong> {user?.email}
          </div>
          <div className="info-item">
            <strong>Роль:</strong> {user?.role === 'student' ? 'Студент' : 'Преподаватель'}
          </div>
        </div>

        <div className="profile-form-container">
          <h2>Редактировать профиль</h2>
          {message && (
            <div className={message.includes('Ошибка') ? 'error-message' : 'success-message'}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="full_name">ФИО:</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            {user?.role === 'student' && (
              <div className="form-group">
                <label htmlFor="group_name">Группа:</label>
                <input
                  type="text"
                  id="group_name"
                  name="group_name"
                  value={formData.group_name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            )}

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;


