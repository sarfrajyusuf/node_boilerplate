import rampsData from '../data/ramp.json';
import { createConnection } from './sql';

// Function to create the ramps table if it does not exist
const createRampsTableIfNotExists = async (connection: any) => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ramps (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(128) NOT NULL UNIQUE,
            type ENUM('ON_RAMP', 'OFF_RAMP') NOT NULL,
            description TEXT,
            api_url VARCHAR(256) NOT NULL,
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;
    await connection.execute(createTableQuery);
};

export const insertRampsData = async () => {
    try {
        const connection = await createConnection();

        await createRampsTableIfNotExists(connection);

        for (const item of rampsData) {
            const { name, type, description, apiUrl, isActive } = item;
            const now = new Date(); // Current date and time

            // Check if the record already exists
            const [rows]: any = await connection.execute(
                `SELECT * FROM ramps WHERE name = ?`,
                [name]
            );

            if (rows.length === 0) {
                // Insert the new record
                await connection.execute(
                    `INSERT INTO ramps (name, type, description, api_url, is_active, created_at, updated_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [name, type, description, apiUrl, isActive, now, now]
                );
                console.log(`Inserted ${name} into the ramps table.`);
            } else {
                console.log(`${name} already exists in the ramps table.`);
            }
        }

        // Close the connection
        await connection.end();
    } catch (error) {
        console.error('Error processing data:', error);
    }
};
