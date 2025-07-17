'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    static associate(models) {}
  }
  Document.init({
    title: DataTypes.STRING,
    file_path: DataTypes.STRING,
    embedded: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Document',
    tableName: 'documents',
    timestamps: false,
  });
  return Document;
}; 