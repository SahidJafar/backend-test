import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("salaries", (table: Knex.TableBuilder) => {
    table.uuid("id").primary().notNullable()
    table.decimal("basic_salary", 10, 2).notNullable()
    table.decimal("bonus", 10, 2).notNullable()
    table.decimal("deduction", 10, 2).notNullable()
    table.decimal("net_salary", 10, 2).notNullable()
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {}
