'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Grade extends Model {
    static associate(models) {
      Grade.belongsTo(models.User, { foreignKey: 'student_id', as: 'student' });
      Grade.belongsTo(models.AssignmentSubmission, { foreignKey: 'submission_id', as: 'submission' });
      Grade.belongsTo(models.Course, { foreignKey: 'course_id', as: 'course' });
    }
  }
  
  Grade.init({
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Courses',
        key: 'id'
      }
    },
    submission_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'AssignmentSubmissions',
        key: 'id'
      }
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    },
    max_score: {
      type: DataTypes.INTEGER,
      defaultValue: 100
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    graded_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Grade',
  });
  
  return Grade;
};


