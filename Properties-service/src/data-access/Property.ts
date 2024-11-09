import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { Image } from './Image';
import { Unavailable } from './Unavailability';

export const Property = sequelize.define('Property', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    adultsQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    childrenQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    doubleBeds: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    simpleBeds: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ac: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    wifi: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
    garaje: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    beachDistance: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    balneario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    neighborhood: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ownerEmail: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Properties',
    timestamps: false
});


Property.hasMany(Image, { foreignKey: 'propertyId' });
Image.belongsTo(Property, { foreignKey: 'propertyId' });
Property.hasMany(Unavailable, { foreignKey: 'propertyId' });
Unavailable.belongsTo(Property, { foreignKey: 'propertyId' });