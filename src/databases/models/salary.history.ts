import { Model, ModelObject } from "objection"
import { SalariesModel } from "./salaries"
import { SalaryMasterModel } from "./salary.master"

export class SalaryHistoryModel extends Model {
  id!: string
  payment_date!: Date
  payment_method!: "cash" | "transfer"
  created_at!: Date
  updated_at!: Date

  protected static nameOfTable = "salary_history"

  static get tableName(): string {
    return this.nameOfTable
  }

  static get relationMappings() {
    return {
      salarymaster: {
        relation: Model.HasManyRelation,
        modelClass: SalaryMasterModel,
        join: {
          from: "salary_history.id",
          to: "salary_master.salary_history_id",
        },
      },
    }
  }
}

export type SalaryHistory = ModelObject<SalaryHistoryModel>
