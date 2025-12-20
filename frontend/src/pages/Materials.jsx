import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { materialsAPI } from '../services/api';
import './Materials.css';

const Materials = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const response = await materialsAPI.getAll();
      setMaterials(response.data);
    } catch (error) {
      console.error('Ошибка загрузки материалов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (fileUrl) => {
    window.open(`http://localhost:5000${fileUrl}`, '_blank');
  };

  if (loading) {
    return <div className="loading">Загрузка материалов...</div>;
  }

  return (
    <div className="materials">
      <h1>Учебные материалы</h1>

      <div className="materials-list">
        {materials.length === 0 ? (
          <p>Нет доступных материалов</p>
        ) : (
          materials.map((material) => (
            <div key={material.id} className="material-card">
              <div className="material-header">
                <h3>{material.title}</h3>
                <span className="material-course">{material.course?.name}</span>
              </div>
              {material.description && (
                <p className="material-description">{material.description}</p>
              )}
              <div className="material-footer">
                {material.file_url && (
                  <button
                    onClick={() => handleDownload(material.file_url)}
                    className="btn-download"
                  >
                    Скачать файл
                  </button>
                )}
                <span className="material-type">{material.type}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Materials;


