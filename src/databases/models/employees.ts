import { Model, ModelObject } from "objection"
import { SalariesModel } from "./salaries"
import { SalaryMasterModel } from "./salary.master"

export class EmployeeModel extends Model {
  id!: string
  fullname!: string
  no_hp!: string
  address!: string
  province_id!: number
  city_id!: number
  district_id!: number
  subdistrict_id!: number
  position!: string
  date_joined!: Date
  status!: string
  image!: string
  bank_name!: string
  bank_account!: string
  created_at!: Date
  updated_at!: Date

  protected static nameOfTable = "employees"

  static get tableName(): string {
    return this.nameOfTable
  }
  static get relationMappings() {
    return {
      salarymaster: {
        relation: Model.HasManyRelation,
        modelClass: SalaryMasterModel,
        join: {
          from: "employees.id",
          to: "salary_master.employee_id",
        },
      },
    }
  }
}

export type Employees = ModelObject<EmployeeModel>
