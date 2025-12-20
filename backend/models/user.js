'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Связи пользователя
      User.hasMany(models.Assignment, { foreignKey: 'teacher_id', as: 'createdAssignments' });
      User.hasMany(models.AssignmentSubmission, { foreignKey: 'student_id', as: 'submissions' });
      User.hasMany(models.Grade, { foreignKey: 'student_id', as: 'grades' });
      User.hasMany(models.Schedule, { foreignKey: 'teacher_id', as: 'teachingSchedule' });
      User.belongsToMany(models.Course, { through: 'StudentCourses', foreignKey: 'student_id', as: 'courses' });
    }

    // Метод для проверки пароля
    async validPassword(password) {
      return await bcrypt.compare(password, this.password);
    }
  }
  
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('student', 'teacher', 'admin'),
      defaultValue: 'student'
    },
    group_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      // Хешируем пароль перед созданием пользователя
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      // Хешируем пароль перед обновлением (если пароль изменен)
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });
  
  return User;
};