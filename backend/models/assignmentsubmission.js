'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AssignmentSubmission extends Model {
    static associate(models) {
      AssignmentSubmission.belongsTo(models.Assignment, { foreignKey: 'assignment_id', as: 'assignment' });
      AssignmentSubmission.belongsTo(models.User, { foreignKey: 'student_id', as: 'student' });
      AssignmentSubmission.hasOne(models.Grade, { foreignKey: 'submission_id', as: 'grade' });
    }
  }
  
  AssignmentSubmission.init({
    assignment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Assignments',
        key: 'id'
      }
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    attachments: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    submitted_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM('submitted', 'graded', 'returned'),
      defaultValue: 'submitted'
    }
  }, {
    sequelize,
    modelName: 'AssignmentSubmission',
  });
  
  return AssignmentSubmission;
};


