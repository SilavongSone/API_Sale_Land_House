import { DataTypes, Model } from "sequelize";
import sequelize from "../db";
import Sale from "./Sale";
import Payment from "./Payment";

class Currency extends Model {
  public currencyId!: number;
  public currencyName!: string;
  public symbol!: string;
  public exchangeRate!: number;
  public isDefault!: boolean;
  public status!: "ACTIVE" | "INACTIVE";
  public createdAt!: Date;
  public updatedAt!: Date;
}

Currency.init(
  {
    currencyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    currencyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    exchangeRate: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: false,
      get() {
        const value = this.getDataValue("exchangeRate");
        return value ? parseFloat(value) : 0;
      },
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Currency",
    tableName: "tbl_currencies",
    timestamps: true,
  }
);

// แยก associations ออกเป็นฟังก์ชัน
export const initAssociations = () => {
  Currency.hasMany(Sale, { foreignKey: "currencyId", as: "sales" });
  Currency.hasMany(Payment, { foreignKey: "currencyId", as: "payments" });
};

export default Currency;
