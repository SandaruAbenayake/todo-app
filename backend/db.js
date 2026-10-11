const mysql = require('mysql2/promise');
require('dotenv').config();

const config = {
  host: process.env.MYSQL_HOST || 'mysql',
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'rootpassword',
  database: process.env.MYSQL_DATABASE || 'todo_db'
};

async function waitForDatabase() {
  while (true) {
    try {
      const connection = await mysql.createConnection(config);
      await connection.ping();
      await connection.end();
      console.log('MySQL is ready. Starting the backend server...');
      return;
    } catch (error) {
      console.log('Waiting for MySQL to be ready...');
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

waitForDatabase();
