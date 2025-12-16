import { DataTypes, Model } from "sequelize";
import sequelize from "../db";
import Project from "./Project";
import LandPlot from "./LandPlot";
import House from "./House";
import Sale from "./Sale";

class Zone extends Model {
  public zoneId!: number;
  public zoneCode!: string;
  public projectId?: number;
  public zoneName!: string;
  public zoneType!: string;
  public totalLandArea!: number;
  public pricePerSqm!: number;
  public persen!: number;
  public description!: string;
  public status!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

}

Zone.init(
  {
    zoneId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    zoneCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    projectId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    zoneName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zoneType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalLandArea: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pricePerSqm: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    persen: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    description: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },
    // createdAt: DataTypes.DATE,
    // updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Zone",
    tableName: "tbl_zones",
    timestamps: true,
  }
);
export const initAssociations = () => {
  // Associations
  Zone.belongsTo(Project, { foreignKey: "projectId", as: "project", onDelete: "RESTRICT", onUpdate: "CASCADE" });
  Zone.hasMany(LandPlot, { foreignKey: "zoneId", as: "landPlots" });
  Zone.hasMany(House, { foreignKey: "zoneId", as: "houses" });
  Zone.hasMany(Sale, { foreignKey: "zoneId", as: "sales" });
};
export default Zone;