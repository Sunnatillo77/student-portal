import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { scheduleAPI } from '../services/api';
import './Schedule.css';

const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

const Schedule = () => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const response = await scheduleAPI.getAll();
      setSchedule(response.data);
    } catch (error) {
      console.error('Ошибка загрузки расписания:', error);
    } finally {
      setLoading(false);
    }
  };

  // Группируем по дням недели
  const groupedSchedule = schedule.reduce((acc, item) => {
    const day = item.day_of_week;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(item);
    return acc;
  }, {});

  // Сортируем занятия по времени в каждом дне
  Object.keys(groupedSchedule).forEach(day => {
    groupedSchedule[day].sort((a, b) => a.start_time.localeCompare(b.start_time));
  });

  if (loading) {
    return <div className="loading">Загрузка расписания...</div>;
  }

  return (
    <div className="schedule">
      <h1>Расписание</h1>

      <div className="schedule-grid">
        {daysOfWeek.map((dayName, dayIndex) => {
          const daySchedule = groupedSchedule[dayIndex] || [];
          return (
            <div key={dayIndex} className="schedule-day">
              <h2>{dayName}</h2>
              {daySchedule.length === 0 ? (
                <p className="no-classes">Нет занятий</p>
              ) : (
                <div className="schedule-items">
                  {daySchedule.map((item) => (
                    <div key={item.id} className="schedule-item">
                      <div className="schedule-time">
                        {item.start_time} - {item.end_time}
                      </div>
                      <div className="schedule-course">
                        <strong>{item.course?.name}</strong>
                        {item.classroom && (
                          <span className="schedule-classroom">Аудитория: {item.classroom}</span>
                        )}
                        {item.group_name && (
                          <span className="schedule-group">Группа: {item.group_name}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Schedule;


