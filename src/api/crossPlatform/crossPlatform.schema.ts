import { sequelize } from "@/common/db/sequelize"; // Ensure you have your sequelize instance configured here
import { schemaName } from "@/common/utils";
import { DataTypes, Model } from "sequelize";

class CrossChainPlatform extends Model {
  declare id: number;
  declare name: string;
  declare description: string;
  declare apiUrl: string;
  declare isActive: boolean;
}

CrossChainPlatform.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    description: {
      type: new DataTypes.TEXT(),
      allowNull: true,
    },
    apiUrl: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: schemaName.crossChainPlatform, // Replace with your desired table name
    sequelize, // passing the `sequelize` instance is required
  },
);

export default CrossChainPlatform;
