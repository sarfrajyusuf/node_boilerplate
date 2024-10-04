import { sequelize } from "@/common/db/sequelize"; // Ensure you have your sequelize instance configured here
import { schemaName } from "@/common/utils";
import { DataTypes, Model } from "sequelize";

enum RampType {
  ON_RAMP = 'ON-RAMP',
  OFF_RAMP = 'OFF-RAMP'
}

class ramp extends Model {
  declare id: number;
  declare name: string;
  declare type: RampType; // Add enum type for 'ON-RAMP' and 'OFF-RAMP'
  declare description: string;
  declare apiUrl: string;
  declare isActive: boolean;
}

ramp.init(
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
    type: {
      type: new DataTypes.ENUM('ON-RAMP', 'OFF-RAMP'),
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
    tableName: schemaName.ramp, // Replace with your desired table name
    sequelize, // passing the `sequelize` instance is required
  },
);

export default ramp;
