const { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error(
      "❌ Error acquiring client from PostgreSQL pool:",
      err.stack,
    );
  }
  console.log(
    `🚀 Successfully connected to PostgreSQL (${isProduction ? "Cloud Production" : "Local Host"})!`,
  );
  release();
});

module.exports = pool;
