import Users from "./User";
import { DataTypes, Model } from "sequelize";
import sequelize from "../db";
import Sale from "./Sale";
import Currency from "./Currency";

class Payment extends Model {
  public id!: number;                  
  public billNumber!: string;
  public saleId!: number;               
  public amount!: number;
  public month?: string | null;
  public currencyId!: number;           
  public exchangeRate!: number;         
  public type!: number;                 
  public description?: string | null;
  public fileDoc?: string | null;
  public createdById!: number;          
  public status!: number;               
  public balanceAfter?: number | null;  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    billNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    saleId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    month: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currencyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    exchangeRate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      get() {
        const value = this.getDataValue("exchangeRate");
        return value ? parseFloat(value) : 0;
      },
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fileDoc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdById: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    balanceAfter: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Payment",
    tableName: "tbl_payment",
    timestamps: true,
  }
);

// 🔗 Associations
export const initAssociations = () => {
  Payment.belongsTo(Sale, { foreignKey: "saleId", as: "landsale" });
  Payment.belongsTo(Currency, { foreignKey: "currencyId", as: "currency" });
  Payment.belongsTo(Users, { foreignKey: "createdById", as: "creator" });
};

export default Payment;
