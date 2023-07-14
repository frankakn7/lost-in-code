import mysql, { QueryOptions } from "mysql";
import { promisify } from 'util';

const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER || 'lostuser',
  password: process.env.DB_PASSWORD || 'LostInCode2023',
  database: 'db_lost_in_code',
  socketPath: '/tmp/mysql.sock'
});

connection.connect(error => {
  if (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
  console.log('Connected to the database');
});

export interface QueryFunction {
  (query: string | QueryOptions, values?: any): Promise<any>;
}

// Promisify the query method for async/await usage
export default {
  query: promisify(connection.query.bind(connection)) as QueryFunction,
};
