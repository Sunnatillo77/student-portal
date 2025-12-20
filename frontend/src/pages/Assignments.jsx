import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { assignmentsAPI } from '../services/api';
import './Assignments.css';

const Assignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const response = await assignmentsAPI.getMy();
      setAssignments(response.data);
    } catch (error) {
      console.error('Ошибка загрузки заданий:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (assignmentId) => {
    try {
      await assignmentsAPI.submit(assignmentId, { content: submissionText });
      setSelectedAssignment(null);
      setSubmissionText('');
      loadAssignments();
    } catch (error) {
      alert(error.response?.data?.error || 'Ошибка отправки решения');
    }
  };

  if (loading) {
    return <div className="loading">Загрузка заданий...</div>;
  }

  return (
    <div className="assignments">
      <h1>Задания</h1>

      <div className="assignments-list">
        {assignments.length === 0 ? (
          <p>Нет доступных заданий</p>
        ) : (
          assignments.map((assignment) => (
            <div key={assignment.id} className="assignment-card">
              <div className="assignment-header">
                <h3>{assignment.title}</h3>
                <span className="assignment-course">{assignment.course?.name}</span>
              </div>
              {assignment.description && (
                <p className="assignment-description">{assignment.description}</p>
              )}
              <div className="assignment-info">
                <span className="assignment-due">
                  Срок сдачи: {new Date(assignment.due_date).toLocaleDateString('ru-RU')}
                </span>
                <span className="assignment-score">Макс. балл: {assignment.max_score}</span>
              </div>
              {user?.role === 'student' && (
                <button
                  onClick={() => setSelectedAssignment(assignment)}
                  className="btn-submit"
                >
                  Отправить решение
                </button>
              )}
              {selectedAssignment?.id === assignment.id && (
                <div className="submission-form">
                  <textarea
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Введите ваше решение..."
                    rows={5}
                  />
                  <div className="submission-actions">
                    <button
                      onClick={() => handleSubmit(assignment.id)}
                      className="btn-primary"
                    >
                      Отправить
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAssignment(null);
                        setSubmissionText('');
                      }}
                      className="btn-cancel"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Assignments;


