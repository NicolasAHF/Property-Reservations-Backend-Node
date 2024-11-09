import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import Account from "./Account";

class Card extends Model {
    public id!: number;
    public cardNum!: number;
    public cvv!: number;
    public expMonth!: number;
    public expYear!: number;
    public accountId!: number;
}

Card.init({
    cardNum: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cvv: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    expMonth: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    expYear: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    accountId: { 
        type: DataTypes.INTEGER,
        references: {
            model: Account, 
            key: 'id', 
        }
    }
}, {
    sequelize,
    tableName: 'card'
});

Card.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });

export default Card;