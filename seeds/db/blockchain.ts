import blockchain from '../data/blockchain.json'
import { createConnection } from './sql';

// Function to create the blockchain table if it does not exist
const createBlockchainTableIfNotExists = async (connection: any) => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS blockchains (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            chain_id INT NOT NULL UNIQUE,
            symbol VARCHAR(255) NOT NULL,
            rpc_Url VARCHAR(255) NOT NULL,
            explorer_url VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;
    await connection.execute(createTableQuery);
};

// Function to insert data into the blockchain table if it does not exist

export const insertBlockchainData = async () => {
    try {
        const connection = await createConnection();

        // Ensure the table exists
        await createBlockchainTableIfNotExists(connection);

        for (const item of blockchain) {
            const { name, chainId, symbol, rpcUrl, explorerUrl } = item;
            const now = new Date(); // Current date and time

            // Check if the record already exists
            const [rows]: any = await connection.execute(
                `SELECT * FROM blockchains WHERE chain_id = ?`,
                [chainId]
            );

            if (rows.length === 0) {
                // Insert the new record
                await connection.execute(
                    `INSERT INTO blockchains (name, chain_id, symbol, rpc_url, explorer_url, created_at, updated_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [name, chainId, symbol, rpcUrl, explorerUrl, now, now]
                );
                console.log(`Inserted ${name} (${symbol}) into the blockchains table.`);
            } else {
                console.log(`${name} (${symbol}) already exists in the blockchain table.`);
            }
        }

        // Close the connection
        await connection.end();
    } catch (error) {
        console.error('Error processing data:', error);
    }
};