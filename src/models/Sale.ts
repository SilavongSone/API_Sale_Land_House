import { DataTypes, Model } from "sequelize";
import sequelize from "../db";
import Zone from "./Zone";
import LandPlot from "./LandPlot";
import House from "./House";
import Customer from "./Customer";
import Staff from "./Staff";
import Currency from "./Currency";
import Payment from "./Payment";

class Sale extends Model {
  public id!: number;
  public saleCode!: string;

  public propertyType!: "LAND" | "HOUSE";
  public zoneId!: number;
  public landPlotId!: number | null;
  public houseId!: number | null;

  public customerId!: number;
  public sellerId!: number;

  public price!: number;
  public totalPrice!: number;
  public discountAmount!: number;

  public downPayment!: number;
  public installmentMonths!: number;
  public monthlyPayment!: number;
  public interestRate!: number;

  public currencyId!: number;
  public exchangeRate!: number;

  public saleStatus!: "DRAFT" | "CONFIRMED" | "SUCCEDED" | "CANCELLED";
  public paymentStatus!: "PENDING" | "PAID" | "OVERDUE";

  public notes!: string | null;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Sale.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    saleCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    propertyType: {
      type: DataTypes.ENUM("LAND", "HOUSE"),
      allowNull: false,
    },

    zoneId: DataTypes.INTEGER.UNSIGNED,

    landPlotId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },

    houseId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },

    customerId: DataTypes.INTEGER.UNSIGNED,
    sellerId: DataTypes.INTEGER.UNSIGNED,

    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    discountAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    downPayment: DataTypes.INTEGER,
    installmentMonths: DataTypes.INTEGER.UNSIGNED,
    monthlyPayment: DataTypes.INTEGER,
    interestRate: DataTypes.INTEGER,

    // totalPaid: {
    //   type: DataTypes.DECIMAL(18, 2),
    //   defaultValue: 0,
    // },

    // remainingBalance: {
    //   type: DataTypes.DECIMAL(18, 2),
    //   defaultValue: 0,
    // },

    // saleDate: DataTypes.DATE,
    // contractDate: DataTypes.DATE,
    // contractNumber: DataTypes.STRING,

    currencyId: DataTypes.INTEGER.UNSIGNED,

    exchangeRate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      get() {
        const value = this.getDataValue("exchangeRate");
        return value ? parseFloat(value) : 0;
      },
    },

    saleStatus: DataTypes.ENUM("DRAFT", "CONFIRMED", "SUCCEDED", "CANCELLED"),
    paymentStatus: DataTypes.ENUM("PENDING", "PAID", "OVERDUE"),

    notes: DataTypes.TEXT,

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Sale",
    tableName: "tbl_sales",
    timestamps: true,
  }
);

export const initAssociations = () => {
  Sale.belongsTo(Zone, { foreignKey: "zoneId", as: "zone" });
  Sale.belongsTo(LandPlot, { foreignKey: "landPlotId", as: "landPlot" });
  Sale.belongsTo(House, { foreignKey: "houseId", as: "house" });
  Sale.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });
  Sale.belongsTo(Staff, { foreignKey: "sellerId", as: "seller" });
  Sale.belongsTo(Currency, { foreignKey: "currencyId", as: "currency" });

  Sale.hasMany(Payment, { foreignKey: "saleId", as: "payments" });
};

export default Sale;
