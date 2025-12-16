import { DataTypes, Model } from "sequelize";
import sequelize from "../db";
import Sale from "./Sale";
import Payment from "./Payment";

class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public role!: string;
  public types!: string | null;
  public status!: "ACTIVE" | "INACTIVE";

  // permissions
  public inserts!: number;
  public updates!: number;
  public deletes!: number;
  public cancels!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // associations
  public readonly sales?: Sale[];
  public readonly payments?: Payment[];
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false },
    types: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.ENUM("ACTIVE", "INACTIVE"), allowNull: false, defaultValue: "ACTIVE" },

    inserts: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
    updates: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
    deletes: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
    cancels: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "tbl_users",
    timestamps: true, // createdAt & updatedAt จะถูกสร้างอัตโนมัติ
  }
);

// 🔗 Associations
export const initAssociations = () => {
  User.hasMany(Sale, { foreignKey: "sellerId", as: "sales" });
  User.hasMany(Payment, { foreignKey: "createdById", as: "payments" });
};

export default User;
