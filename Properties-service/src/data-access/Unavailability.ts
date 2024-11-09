import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export const Unavailable = sequelize.define('Unavailable', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    from: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    to: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    creator: {
        type: DataTypes.STRING,
        allowNull: false
    },
    propertyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Properties',
            key: 'id'
        }
    },
}, {
    tableName: 'Unavailability',
    timestamps: false
});
