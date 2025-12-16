import { DataTypes, Model } from "sequelize";
import sequelize from "../db";
import Province from "./Province";
import Project from "./Project";
import Customer from "./Customer";
import Staff from "./Staff";

class District extends Model {
  public districtId!: number;
  public provinceId!: number;
  public districtName!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

District.init(
  {
    districtId: {
      type: DataTypes.INTEGER.UNSIGNED, // Changed to UNSIGNED
      primaryKey: true,
      autoIncrement: true,
    },
    provinceId: {
      type: DataTypes.INTEGER.UNSIGNED, // Also make this consistent
      allowNull: false,
    },
    districtName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // createdAt: {
    //   type: DataTypes.DATE,
    //   defaultValue: DataTypes.NOW,
    // },
    // updatedAt: {
    //   type: DataTypes.DATE,
    //   defaultValue: DataTypes.NOW,
    // },
  },
  {
    sequelize,
    modelName: "District",
    tableName: "tbl_districts",
    timestamps: true,
  }
);


export const initAssociations = () => {
  District.belongsTo(Province, { foreignKey: "provinceId", as: "province", onDelete: "CASCADE", onUpdate: "CASCADE" });
  District.hasMany(Project, { foreignKey: "districtId", as: "projects" });
  District.hasMany(Customer, { foreignKey: "districtId", as: "customers" });
  District.hasMany(Staff, { foreignKey: "districtId", as: "staffs" });
};

export default District;