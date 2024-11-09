import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export const Reservation = sequelize.define('Reservation', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  propertyId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  adults: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  children: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pendiente',
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'reservations',
});

export default Reservation;
