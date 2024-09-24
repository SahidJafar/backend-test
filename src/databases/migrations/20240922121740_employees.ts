import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("employees", (table: Knex.TableBuilder) => {
    table.uuid("id").primary().notNullable()
    table.string("fullname", 255).notNullable().unique()
    table.string("no_hp", 255).notNullable()
    table.string("address", 255).notNullable()
    table.integer("province_id").notNullable()
    table.integer("city_id").notNullable()
    table.integer("district_id").notNullable()
    table.integer("subdistrict_id").notNullable()
    table.string("position", 255).notNullable()
    table.date("date_joined").notNullable()
    table.enum("status", ["aktif", "tidak aktif"]).notNullable()
    table.string("image", 255).nullable()
    table.string("bank_name", 255).nullable()
    table.string("bank_account", 255).nullable()
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {}
