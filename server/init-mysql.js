// scripts/init-db.js
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const main = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: "root",
    password: process.env.DB_PASSWORD,
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_DATABASE}\`;`
  );

  await connection.end();
};

main();
