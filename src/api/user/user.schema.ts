import { sequelize } from "@/common/db/sequelize"; // Ensure you have your sequelize instance configured here
import { schemaName } from "@/common/utils";
import { DataTypes, Model } from "sequelize";

class User extends Model {
  // Remove public class fields declarations

  // You can still use TypeScript for type-checking if needed
  // Define a type for the model attributes
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare phone: number; // Changed to string to match the schema definition
  declare status: number;
}

User.init(
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
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    phone: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    status: {
      type: new DataTypes.INTEGER(),
      allowNull: true,
    },
  },
  {
    tableName: schemaName.user,
    sequelize, // passing the `sequelize` instance is required
  },
);

export default User;
