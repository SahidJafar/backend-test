import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("salary_master", (table: Knex.TableBuilder) => {
    table.uuid("id").primary().notNullable()
    table.date("period_start").notNullable()
    table.date("period_end").notNullable()
    table.uuid("employee_id").notNullable()
    table.foreign("employee_id").references("id").inTable("employees")
    table.uuid("salary_id").notNullable()
    table.foreign("salary_id").references("id").inTable("salaries")
    table.uuid("salary_history_id").notNullable()
    table.foreign("salary_history_id").references("id").inTable("salary_history")
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("salary_master")
}
