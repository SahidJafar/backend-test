// Update with your config settings.
import { Knex } from "knex"
import dotenv from "dotenv"
import path from "path"
dotenv.config()

dotenv.config({ path: path.join(__dirname, "../../.env") })

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const config: { [key: string]: Knex.Config } = {
  development: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "../databases/migrations",
    },
    seeds: {
      directory: "../databases/seeds",
    },
  },
  production: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: parseInt(process.env.DB_PORT || "3306"),
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "../databases/migrations",
    },
    seeds: {
      directory: "../databases/seeds",
    },
  },
}

export default config
