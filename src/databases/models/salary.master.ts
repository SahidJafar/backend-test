import { Model, ModelObject } from "objection"
import { EmployeeModel } from "./employees"
import { SalaryHistoryModel } from "./salary.history"
import { SalariesModel } from "./salaries"

export class SalaryMasterModel extends Model {
  id!: string
  period_start!: Date
  period_end!: Date
  employee_id!: string
  salary_id!: string
  salary_history_id!: string
  created_at!: Date
  updated_at!: Date

  protected static nameOfTable = "salary_master"

  static get tableName(): string {
    return this.nameOfTable
  }

  static get relationMappings() {
    return {
      employee: {
        relation: Model.BelongsToOneRelation,
        modelClass: EmployeeModel,
        join: {
          from: "salary_master.employee_id",
          to: "employees.id",
        },
      },

      salary: {
        relation: Model.HasManyRelation,
        modelClass: SalariesModel,
        join: {
          from: "salary_master.salary_id",
          to: "salaries.id",
        },
      },
      salaryhistory: {
        relation: Model.HasManyRelation,
        modelClass: SalaryHistoryModel,
        join: {
          from: "salary_master.salary_history_id",
          to: "salary_history.d",
        },
      },
    }
  }
}

export type SalaryMaster = ModelObject<SalaryMasterModel>
