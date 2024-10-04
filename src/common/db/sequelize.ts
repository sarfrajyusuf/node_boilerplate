import { env } from "@/config/envConfig";
import { logger } from "@/server";
import { Sequelize } from "sequelize";

class Database {
  public static instance: Sequelize;

  private constructor() {}

  public static getInstance(): Sequelize {
    if (!Database.instance) {
      const connectionConfig = `mysql://${env.SQL_USER}:${env.SQL_PASSWORD}@${env.SQL_HOST}/${env.SQL_DATABASE}`;

      Database.instance = new Sequelize(connectionConfig, {
        dialect: "mysql",
        logging: false,
        define: {
          charset: "utf8",
          collate: "utf8_general_ci",
          underscored: true,
          timestamps: true,
        },
        pool: {
          max: 5,
          min: 0,
          idle: 20000,
          acquire: 20000,
        },
      });

      // Synchronize database tables
      Database.syncTables();
    }

    return Database.instance;
  }

  private static async syncTables() {
    try {
      await Database.instance.sync({ alter: true });
    } catch (error) {
      console.log("Err", error);
      logger.error("Error synchronizing database tables:", error);
    }
  }
}

// Test the database connection
const checkConnection = async () => {
  try {
    const sequelize = Database.getInstance();
    await sequelize.authenticate();
    logger.info("Connection has been established successfully.");
  } catch (error) {
    logger.error("Unable to connect to the SQL database:", error);
    process.exit(1);
  }
};

const sequelize = Database.getInstance();

// Export the single instance of Sequelize and the checkConnection function
export { sequelize, checkConnection };
