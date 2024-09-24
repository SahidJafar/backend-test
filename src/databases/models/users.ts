import { Model, ModelObject } from "objection"

export class UsersModel extends Model {
  id!: string
  name!: string
  email!: string
  password!: string
  token!: string
  refresh_token!: string

  protected static nameOfTable = "users"
  static get tableName(): string {
    return this.nameOfTable
  }
}

export type Users = ModelObject<UsersModel>
