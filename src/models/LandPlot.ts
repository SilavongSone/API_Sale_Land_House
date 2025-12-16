import { DataTypes, Model } from "sequelize";
import sequelize from "../db";
import Zone from "./Zone";
import Sale from "./Sale";

class LandPlot extends Model {
  public landPlotId!: number;
  public zoneId!: number;
  public plotNumber!: string;
  public landArea!: number;
  public plotWidth!: number;
  public plotLength!: number;
  public pricePerSqm!: number;
  public totalPrice!: number;
  public landTitleNumber!: string;
  public notes!: string;
  public status!: "AVAILABLE" | "SOLD" | "RESERVED";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

LandPlot.init(
  {
    landPlotId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    zoneId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    plotNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    landArea: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    plotWidth: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
    plotLength: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
    pricePerSqm: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    totalPrice: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    landTitleNumber: { type: DataTypes.STRING, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM("AVAILABLE", "SOLD", "RESERVED"), allowNull: false, defaultValue: "AVAILABLE" },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: "LandPlot",
    tableName: "tbl_land_plots",
    timestamps: true,
  }
);

// แยก associations ออกเป็นฟังก์ชัน
export const initAssociations = () => {
  LandPlot.belongsTo(Zone, { foreignKey: "zoneId", as: "zone", onDelete: "CASCADE", onUpdate: "CASCADE" });
  LandPlot.hasMany(Sale, { foreignKey: "landPlotId", as: "sales", onDelete: "SET NULL", onUpdate: "CASCADE" });
};

export default LandPlot;
