import { DataTypes, Model } from "sequelize";
import sequelize from "../db";
import House from "./House";
import Customer from "./Customer";

class Maintenance extends Model {
  public id!: number;
  public houseId!: number | null;
  public customerId!: number;
  public requestType!: string;
  public category!: string;
  public priority!: "LOW" | "MEDIUM" | "HIGH";
  public description!: string;
  public requestDate!: Date;
  public completedDate!: Date | null;
  public status!: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  public resolution!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Maintenance.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    requestCode: { type: DataTypes.STRING, unique: true, allowNull: false },
    houseId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, },
    customerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    requestType: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    priority: { type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"), allowNull: false, defaultValue: "LOW" },
    description: { type: DataTypes.TEXT, allowNull: false },
    requestDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    completedDate: { type: DataTypes.DATE, allowNull: true },
    status: { type: DataTypes.ENUM("PENDING", "IN_PROGRESS", "COMPLETED"), allowNull: false, defaultValue: "PENDING" },
    resolution: { type: DataTypes.TEXT, allowNull: true },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: "Maintenance",
    tableName: "tbl_maintenances",
    timestamps: true,
  }
);

// แยก associations ออกเป็นฟังก์ชัน
export const initAssociations = () => {
  Maintenance.belongsTo(House, { foreignKey: "houseId", as: "house", onDelete: "CASCADE", onUpdate: "CASCADE" });
  Maintenance.belongsTo(Customer, { foreignKey: "customerId", as: "customer", onDelete: "CASCADE", onUpdate: "CASCADE" });
};

export default Maintenance;
