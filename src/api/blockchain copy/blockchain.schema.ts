import { sequelize } from "@/common/db/sequelize"; // Ensure you have your sequelize instance configured here
import { schemaName } from "@/common/utils";
import { DataTypes, Model } from "sequelize";

class Blockchain extends Model {
  declare id: number;
  declare name: string;
  declare chainId: number;
  declare symbol: string;
  declare rpcUrl: string;
  declare explorerUrl: string;
}

Blockchain.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      // unique: true,
    },
    chainId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      // unique: true,
    },
    symbol: {
      type: new DataTypes.STRING(16),
      allowNull: false,
    },
    rpcUrl: {
      type: new DataTypes.STRING(256),
      allowNull: false,
    },
    explorerUrl: {
      type: new DataTypes.STRING(256),
      allowNull: false,
    },
  },
  {
    tableName: schemaName.blockchain,
    sequelize, // passing the `sequelize` instance is required
  },
);

export default Blockchain;
