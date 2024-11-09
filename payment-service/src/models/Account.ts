import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class Account extends Model {
    public id!: number;
    public balance!: number;
}

Account.init({
    balance: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'account'
});

export default Account;