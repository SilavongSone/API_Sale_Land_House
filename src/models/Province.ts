import { DataTypes, Model } from "sequelize";
import sequelize from "../db";
import District from "./District";

class Province extends Model {
  public provinceId!: number;
  public provinceName!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Province.init(
  {
    provinceId: {
      type: DataTypes.INTEGER.UNSIGNED, // Changed to UNSIGNED
      primaryKey: true,
      autoIncrement: true,
    },
    provinceName: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: "Province",
    tableName: "tbl_provinces",
    timestamps: true,
  }
);

export const initAssociations = () => {
  Province.hasMany(District, { foreignKey: "provinceId", as: "districts" });
};

export default Province;