import { DataTypes, Model, INTEGER } from "sequelize";
import sequelize from "../db";
import Zone from "./Zone";
import Sale from "./Sale";
import Maintenance from "./Maintenance";

class House extends Model {
  public id!: number;
  public zoneId!: number;
  public houseNumber!: string;
  public houseType!: string;
  public landArea!: number;
  public builtArea!: number;
  public usableArea!: number;
  public totalFloors!: number;
  public bedrooms!: number;
  public bathrooms!: number;
  public parkingSpaces!: number;
  public housePrice!: number;
  public buildYear!: number | null;
  public houseDirection!: string | null;
  public description!: string | null;
  public status!: "AVAILABLE" | "SOLD" | "RESERVED";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

House.init(
  {
    id: {
      type: INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,

    },
    zoneId: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
    },
    houseNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    houseType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "SINGLE",
    },
    landArea: { type: INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    builtArea: { type: INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    usableArea: { type: INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    totalFloors: { type: INTEGER.UNSIGNED, defaultValue: 1 },
    bedrooms: { type: INTEGER.UNSIGNED, defaultValue: 1 },
    bathrooms: { type: INTEGER.UNSIGNED, defaultValue: 1 },
    parkingSpaces: { type: INTEGER.UNSIGNED, defaultValue: 0 },
    housePrice: { type: INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    buildYear: { type: INTEGER.UNSIGNED, allowNull: true },
    houseDirection: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    status: {
      type: DataTypes.ENUM("AVAILABLE", "SOLD", "RESERVED"),
      allowNull: false,
      defaultValue: "AVAILABLE",
    },
  },
  {
    sequelize,
    modelName: "House",
    tableName: "tbl_houses",
    timestamps: true,
  }
);

export const initAssociations = () => {
  House.belongsTo(Zone, { foreignKey: "zoneId", as: "zone", onDelete: "CASCADE", onUpdate: "CASCADE" });
  House.hasMany(Sale, { foreignKey: "houseId", as: "sales", onDelete: "CASCADE", onUpdate: "CASCADE" });
  House.hasMany(Maintenance, { foreignKey: "houseId", as: "maintenances", onDelete: "CASCADE", onUpdate: "CASCADE" });
};

export default House;
