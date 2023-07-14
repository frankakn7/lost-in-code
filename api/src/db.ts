import mysql from "mysql2/promise";

class Database {
  private connection: mysql.Connection | null = null;
  
  async connectWithRetry(retryCount = 12) {
    try {
      const connectionConfig:any = {
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
    if (!this.connection) {
      await this.connectWithRetry();
    }
    if (!this.connection) {
      throw new Error("Failed to establish database connection after retrying.");
    }
    return this.connection;
  }

  async query(sql: string, args?: any[]) {
    const connection = await this.getConnection();
    const [results, ] = await connection.query(sql, args);
    return results;
  }
}

const dbInstance = new Database();
dbInstance.connectWithRetry();

export default dbInstance;
