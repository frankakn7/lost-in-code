import mysql from "mysql2/promise";

class ConnectionError extends Error {
    constructor(message?: string) {
        super(message); // Pass the message to the base Error class
        this.name = 'ConnectionError';

        // This line is needed to restore the correct prototype chain.
        Object.setPrototypeOf(this, ConnectionError.prototype);
    }
}

class Database {
    private connection: mysql.Connection | null = null;

    async connectWithRetry(retryCount = 12) {
        try {
            const connectionConfig: any = {
                host: process.env.DB_HOST || 'localhost',
                user: process.env.MYSQL_USER || 'lostuser',
                password: process.env.MYSQL_PASSWORD || 'LostInCode2023',
                database: process.env.MYSQL_DATABASE || 'db_lost_in_code',
            };

            if (process.env.USE_SOCKET_PATH) {
                connectionConfig.socketPath = '/tmp/mysql.sock';
            }

            this.connection = await mysql.createConnection(connectionConfig);

            console.log('Connected to the database');
        } catch (error) {
            console.error('Error connecting to the database:', error);
            if (retryCount > 0) {
                console.log('Retrying in 5 seconds...');
                setTimeout(() => this.connectWithRetry(retryCount - 1), 5000);
            } else {
                console.error('Could not connect to database after multiple retries, exiting...');
                process.exit(1); // Exit the process with an error code
            }
        }
    }

    async getConnection() {
        try {
            // If the connection exists, try to execute a simple query
            if (this.connection) {
                await this.connection.query('SELECT 1');
            } else {
                await this.connectWithRetry();
            }
        } catch (error) {
            console.log('Database connection lost. Reconnecting...');
            await this.connectWithRetry();
        }
        if (!this.connection) {
            throw new ConnectionError("Failed to establish database connection after retrying.");
        }
        return this.connection;
    }

    async query(sql: string, args?: any[]) {
        try {
            const connection = await this.getConnection();
            const [results,] = await connection.query(sql, args);
            return results;
        } catch (error) {
            if (error instanceof ConnectionError) {
                console.error('Caught a connection error:', error.message);
            } else {
                // Rethrow the error if it's not a ConnectionError, as it's an unexpected error that this code can't handle
                throw error;
            }
        }
    }
}

const dbInstance = new Database();
dbInstance.connectWithRetry();

export default dbInstance;
