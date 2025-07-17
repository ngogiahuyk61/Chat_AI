'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.Conversation, { foreignKey: 'conversation_id' });
    }
  }
  Message.init({
    conversation_id: DataTypes.INTEGER,
    sender: DataTypes.STRING,
    message: DataTypes.TEXT,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'messages',
    timestamps: false,
  });
  return Message;
}; 