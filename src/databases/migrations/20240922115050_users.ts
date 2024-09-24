import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table: Knex.TableBuilder) => {
    table.uuid("id").primary().notNullable()
    table.string("name", 255).notNullable()
    table.string("email", 255).notNullable().unique()
    table.string("password", 255).notNullable()
    table.string("token", 1024)
    table.string("refresh_token", 1024)
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users")
}
