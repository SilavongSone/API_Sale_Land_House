import { DataTypes, Model } from "sequelize";
import sequelize from "../db";
import District from "./District";
import Zone from "./Zone";
import Expense from "./Expense";

class Project extends Model {
  public projectId!: number;
  public projectName!: string;
  public totalLandArea!: number;
  public totalWidth!: number;
  public totalLength!: number;
  public village!: string;
  public districtId!: number;
  public landOwnerName!: string;
  public landOwnerPhone!: string;


  public price!: number;
  public description!: string;
  public status!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Project.init(
  {
    projectId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    projectName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalLandArea: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    totalWidth: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    totalLength: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    village: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    districtId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    landOwnerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    landOwnerPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },


    price: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    description: DataTypes.TEXT,
    status: {
      type: DataTypes.STRING,
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
    modelName: "Project",
    tableName: "tbl_projects",
    timestamps: true,
  }
);
export const initAssociations = () => {
  // Project → District
  Project.belongsTo(District, {
    foreignKey: "districtId",
    as: "district",
    onDelete: "SET NULL",   // dont delete Project if District is deleted
    onUpdate: "CASCADE",
  });

  // Project → Zone
  Project.hasMany(Zone, {
    foreignKey: "projectId",
    as: "zones",
    onDelete: "RESTRICT",   // delete Zone automatically if Project is deleted
    onUpdate: "CASCADE",
  });

  // Project → Expense
  Project.hasMany(Expense, {
    foreignKey: "projectId",
    as: "expenses",
    onDelete: "CASCADE",   // delete Expense automatically if Project is deleted 
    onUpdate: "CASCADE",
  });
};

export default Project;
