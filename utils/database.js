import mysql from "mysql2/promise";
const logger = require("./logger");

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
  connectionLimit: 10, // Set the maximum number of connections in the pool
});

export async function connectWithRetry(retries = 3) {
  while (retries > 0) {
    try {
      const connection = await pool.getConnection();
      // console.info("Connected to MySQL database");
      return connection;
    } catch (err) {
      logger.error("Error connecting to MySQL database:", err);
      retries--;
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
    }
  }
  throw new Error("Failed to connect to MySQL database after retries");
}

export async function executeQuery(query, values = []) {
  const connection = await connectWithRetry();
  try {
    const [results] = await connection.query(query, values);
    connection.release();
    return results;
  } catch (err) {
    logger.error("Error executing MySQL query:", err);
    throw err; // Re-throw the error for handling in the route
  } finally {
    connection.release(); // Release the connection even on error
  }
}