import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { Property } from './Property';

export const Image = sequelize.define('Image', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Property,
      key: 'id'
    }
  }
}, {
  tableName: 'Images',
  timestamps: false
});
