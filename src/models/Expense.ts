import { DataTypes, Model } from "sequelize";
import sequelize from "../db";
import Project from "./Project";

class Expense extends Model {
  public id!: number;
  public projectId!: number;
  public expenseCode!: string;
  public category!: string;
  public description!: string;
  public amount!: number;
  public expenseDate!: Date;
  public vendor!: string | null;
  public receiptUrl!: string | null;
  public notes!: string | null;
  public createdAt!: Date;
}

Expense.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    projectId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    expenseCode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    category: DataTypes.STRING,
    description: DataTypes.STRING,
    amount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    expenseDate: DataTypes.DATE,
    vendor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    receiptUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Expense",
    tableName: "tbl_expenses",
    timestamps: false,
  }
);

// แยก associations ออกเป็นฟังก์ชัน
export const initAssociations = () => {
  Expense.belongsTo(Project, { foreignKey: "projectId", as: "project" });
};

export default Expense;
