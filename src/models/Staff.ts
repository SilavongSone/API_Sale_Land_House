import { DataTypes, Model } from "sequelize";
import sequelize from "../db";
import District from "./District";
import Sale from "./Sale";


class Staff extends Model {
  public staffId!: number;
  public staffCode!: string;
  public firstName!: string;
  public lastName!: string;
  public dateOfBirth?: Date;
  public phone!: string;
  public email!: string;
  public village!: string;
  public districtId!: number;
  public position!: string;
  public department!: string;
  public basicSalary!: number;
  public notes!: string;
  public status!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Staff.init(
  {
    staffId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    staffCode: {
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
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: DataTypes.STRING,
    village: DataTypes.STRING,
    districtId: DataTypes.INTEGER.UNSIGNED,
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: DataTypes.STRING,
    hireDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    basicSalary: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,

    },

    notes: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Staff",
    tableName: "tbl_staffs",
    timestamps: true,
  }
);
export const initAssociations = () => {
  // Associations
  Staff.belongsTo(District, { foreignKey: "districtId", as: "district" });
  Staff.hasMany(Sale, { foreignKey: "sellerId", as: "sales" });
};
export default Staff;