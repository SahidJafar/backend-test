import { hashPassword } from "../../utils/bcrypt.password"
import { Knex } from "knex"
import { v4 as uuidv4 } from "uuid"

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del()

  async function createUser(name: string, email: string, password: string) {
    return {
      id: uuidv4(),
      name,
      email,
      password: await hashPassword(password),
    }
  }

  // Inserts seed entries
  const users = [await createUser("Admin 1", "admin1@gmail.com", "password"), await createUser("Admin 2", "admin2@gmail.com", "password")]

  await knex("users").insert(users)
}
