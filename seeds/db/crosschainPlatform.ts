import crossChainPlatforms from '../data/crossPlatform.json'
import { createConnection } from './sql';

// Function to create the cross-chain platform table if it does not exist
const createCrossChainTableIfNotExists = async (connection: any) => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS crosschains (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(128) NOT NULL UNIQUE,
            description TEXT,
            api_url VARCHAR(256) NOT NULL,
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;
    await connection.execute(createTableQuery);
};


export const insertCrossChainPlatformData = async () => {
    try {
        const connection = await createConnection();

        await createCrossChainTableIfNotExists(connection);

        for (const item of crossChainPlatforms) {
            const { name, description, apiUrl, isActive } = item;
            const now = new Date(); // Current date and time

            // Check if the record already exists
            const [rows]: any = await connection.execute(
                `SELECT * FROM crosschains WHERE name = ?`,
                [name]
            );

            if (rows.length === 0) {
                // Insert the new record
                await connection.execute(
                    `INSERT INTO crosschains (name, description, api_url, is_active, created_at, updated_at)
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [name, description, apiUrl, isActive, now, now]
                );
                console.log(`Inserted ${name} into the crosschains platform table.`);
            } else {
                console.log(`${name} already exists in the crosschains platform table.`);
            }
        }

        // Close the connection
        await connection.end();
    } catch (error) {
        console.error('Error processing data:', error);
    }
};