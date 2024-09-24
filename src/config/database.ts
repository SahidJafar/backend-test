import knex from "knex"
import config from "./knexfile"

// Connect db from Knex
const database = knex(config[process.env.NODE_ENV || "development"])

export default database
