import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("salary_history", (table: Knex.TableBuilder) => {
    table.uuid("id").primary().notNullable()
    table.date("payment_date").notNullable()
    table.enum("payment_method", ["cash", "transfer"]).notNullable()
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {}
