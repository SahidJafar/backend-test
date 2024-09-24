import { Model, ModelObject } from "objection"
import { EmployeeModel } from "./employees"
import { SalaryHistoryModel } from "./salary.history"
import { SalaryMasterModel } from "./salary.master"

export class SalariesModel extends Model {
  id!: string
  basic_salary!: number
  bonus!: number
  deduction!: number
  net_salary!: number
  created_at!: Date
  updated_at!: Date

  protected static nameOfTable = "salaries"

  static get tableName(): string {
    return this.nameOfTable
  }

  static get relationMappings() {
    return {
      salarymaster: {
        relation: Model.HasManyRelation,
        modelClass: SalaryMasterModel,
        join: {
          from: "salaries.id",
          to: "salary_master.salary_id",
        },
      },
    }
  }
}

export type Salaries = ModelObject<SalariesModel>
