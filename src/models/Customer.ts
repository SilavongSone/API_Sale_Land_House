import { DataTypes, Model } from "sequelize";
import sequelize from "../db";
import District from "./District";
import Sale from "./Sale";
import Maintenance from "./Maintenance";

class Customer extends Model {
  public customerId!: number;
  public customerCode!: string;
  public firstName!: string;
  public lastName!: string;
  public gender?: string;
  public dateOfBirth?: Date;
  public idCard?: string;
  public phone!: string;
  public email?: string;
  public village?: string;
  public districtId?: number;
  public status?: string;
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly district?: District;
  public readonly sales?: Sale[];
  public readonly maintenances?: Maintenance[];
}

Customer.init(
  {
    customerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    customerCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    idCard: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    village: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    districtId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Customer",
    tableName: "tbl_customers",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["customerCode"],
      },
    ],
  }
);

export const initAssociations = () => {
  Customer.belongsTo(District, { foreignKey: "districtId", as: "district" });
  Customer.hasMany(Sale, { foreignKey: "customerId", as: "sales" });
  Customer.hasMany(Maintenance, { foreignKey: "customerId", as: "maintenances" });
};


export default Customer;