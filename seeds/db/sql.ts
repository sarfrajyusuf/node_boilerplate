/* eslint-disable @typescript-eslint/no-explicit-any */
import * as mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const { SQL_USER, SQL_PASSWORD, SQL_HOST, SQL_DATABASE } = process.env;

// Function to create the database if it doesn't exist
const createDb = async (): Promise<boolean> => {
    try {
        console.log("Creating MySQL connection....");
        if (!SQL_HOST) {
            console.log("No Database Config found, please check database configuration.");
            return false;
        }

        const connection = await mysql.createConnection({
            host: SQL_HOST,
            user: SQL_USER,
            password: SQL_PASSWORD,
        });

        console.log("Checking if Database Exists....");
        // Check if the database already exists
        const [rows]: any = await connection.execute(`SHOW DATABASES LIKE '${SQL_DATABASE}'`);

        if (rows.length > 0) {
            console.log(`Database "${SQL_DATABASE}" exists.`);
            console.log(`Starting node server...`);
        } else {
            console.log("Creating Database...");
            await connection.execute(`CREATE DATABASE ${SQL_DATABASE}`);
            console.log(`Database "${SQL_DATABASE}" created.`);
        }

        // Close the connection
        await connection.end();
        return true;
    } catch (error) {
        console.error(`Error creating or checking the database "${SQL_DATABASE}"`);
        console.error(error);
        console.error(`Please create Database manually or check createDb function in mysql.connection`);
        return false;
    }
};

// Function to create a MySQL connection
const createConnection = async () => {
    try {
        if (!SQL_HOST || !SQL_DATABASE) {
            throw new Error("Missing database configuration.");
        }

        const connection = await mysql.createConnection({
            host: SQL_HOST,
            user: SQL_USER,
            password: SQL_PASSWORD,
            database: SQL_DATABASE,
        });

        return connection;
    } catch (error) {
        console.error("Error creating MySQL connection:");
        console.error(error);
        throw error;
    }
};

// Call the function to create the database if it doesn't exist
createDb();

// Export the connection function
export { createConnection };
