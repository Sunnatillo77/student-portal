'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Material extends Model {
    static associate(models) {
      Material.belongsTo(models.Course, { foreignKey: 'course_id', as: 'course' });
      Material.belongsTo(models.User, { foreignKey: 'teacher_id', as: 'teacher' });
    }
  }
  
  Material.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Courses',
        key: 'id'
      }
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    file_size: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('document', 'video', 'link', 'other'),
      defaultValue: 'document'
    }
  }, {
    sequelize,
    modelName: 'Material',
  });
  
  return Material;
};


