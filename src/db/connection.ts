import mysql from 'mysql2/promise';


console.log("DB_HOST:", import.meta.env.DB_HOST);
console.log("DB_USER:", import.meta.env.DB_USER);

const connection = await mysql.createPool({
  host: import.meta.env.DB_HOST,
  user: import.meta.env.DB_USER,
  password: import.meta.env.DB_PASSWORD,
  database: import.meta.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default connection;