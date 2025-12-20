'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      Course.hasMany(models.Assignment, { foreignKey: 'course_id', as: 'assignments' });
      Course.hasMany(models.Material, { foreignKey: 'course_id', as: 'materials' });
      Course.hasMany(models.Schedule, { foreignKey: 'course_id', as: 'schedule' });
      Course.belongsToMany(models.User, { through: 'StudentCourses', foreignKey: 'course_id', as: 'students' });
    }
  }
  
  Course.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    credits: {
      type: DataTypes.INTEGER,
      defaultValue: 3
    }
  }, {
    sequelize,
    modelName: 'Course',
  });
  
  return Course;
};


