const mysql = require('mysql2/promise');

const host = process.env.MYSQL_HOST || 'mysql';
const port = Number(process.env.MYSQL_PORT) || 3306;
const user = process.env.MYSQL_USER || 'root';
const password = process.env.MYSQL_PASSWORD || 'rootpassword';
const database = process.env.MYSQL_DATABASE || 'todo_db';

const maxAttempts = 30;
const retryDelayMs = 1000;

async function waitForDatabase() {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const connection = await mysql.createConnection({
        host,
        port,
        user,
        password,
        database
      });

      await connection.end();
      console.log(`MySQL is ready at ${host}:${port}`);
      return;
    } catch (error) {
      console.log(`Waiting for MySQL (${attempt}/${maxAttempts})...`);

      if (attempt === maxAttempts) {
        console.error('MySQL did not become ready in time.');
        process.exit(1);
      }

      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    }
  }
}

waitForDatabase();
