'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    static associate(models) {
      Conversation.hasMany(models.Message, { foreignKey: 'conversation_id' });
    }
  }
  Conversation.init({
    user_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Conversation',
    tableName: 'conversations',
    timestamps: false,
  });
  return Conversation;
}; 