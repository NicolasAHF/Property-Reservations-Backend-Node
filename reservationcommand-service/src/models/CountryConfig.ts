import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export const CountryConfig = sequelize.define('CountryConfig', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  daysNotice: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  refundPercentage: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
}, {
  tableName: 'country_configs',
  hooks: {
    beforeDestroy: (countryConfig, options) => {
      if (countryConfig.get('country') === 'USA') {
        throw new Error('This CountryConfig cannot be deleted');
      }
    }
  }
});

export default CountryConfig;
