'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Assignment extends Model {
    static associate(models) {
      Assignment.belongsTo(models.Course, { foreignKey: 'course_id', as: 'course' });
      Assignment.belongsTo(models.User, { foreignKey: 'teacher_id', as: 'teacher' });
      Assignment.hasMany(models.AssignmentSubmission, { foreignKey: 'assignment_id', as: 'submissions' });
    }
  }
  
  Assignment.init({
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
    due_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    max_score: {
      type: DataTypes.INTEGER,
      defaultValue: 100
    },
    attachments: {
      type: DataTypes.JSON,
      defaultValue: []
    }
  }, {
    sequelize,
    modelName: 'Assignment',
  });
  
  return Assignment;
};


