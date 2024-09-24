import { SalaryHistoryModel } from "../databases/models/salary.history"
import { SalariesModel } from "../databases/models/salaries"
import { Request, Response } from "express"
import { ResponseHelper } from "../helpers/response.helper"
import { ErrorHelper } from "../helpers/error.helper"
import { EmployeeModel } from "../databases/models/employees"
import { SalaryMasterModel } from "../databases/models/salary.master" // Tambahkan import
import { v4 as uuidv4 } from "uuid"
import { fetchLocation } from "../utils/fetch.location"

export class SalaryController {
  async create(req: Request, res: Response): Promise<void> {
    const trx = await SalariesModel.startTransaction()
    try {
      // Check Employee Exist
      const employee = await EmployeeModel.query(trx).findOne({ id: req.body.employee_id })
      if (!employee) {
        await trx.rollback()
        return ResponseHelper.error("Employee not found", null, 404)(res)
      }

      // Calculate net salary
      const { basic_salary, bonus, deduction } = req.body
      const net_salary = basic_salary + bonus - deduction

      // Insert salary
      const salary = await SalariesModel.query(trx).insert({
        id: uuidv4(),
        basic_salary: basic_salary,
        bonus: bonus,
        deduction: deduction,
        net_salary: net_salary,
      })

      // Insert salary history
      const salary_history = await SalaryHistoryModel.query(trx).insert({
        id: uuidv4(),
        payment_date: req.body.payment_date,
        payment_method: req.body.payment_method,
      })

      // Insert salary master
      const salary_master = await SalaryMasterModel.query(trx).insert({
        id: uuidv4(),
        period_start: req.body.period_start,
        period_end: req.body.period_end,
        employee_id: req.body.employee_id,
        salary_id: salary.id,
        salary_history_id: salary_history.id,
      })

      // Commit the transaction if all inserts succeed
      await trx.commit()

      const data = {
        gaji: {
          ...salary,
        },
        riwayat_gaji: {
          ...salary_history,
        },
        gaji_master: {
          ...salary_master,
        },
      }

      return ResponseHelper.success("Salary, Salary History, and Salary Master created successfully", data, 201)(res)
    } catch (error) {
      await trx.rollback()
      return ErrorHelper.handler(error, res)
    }
  }
  async update(req: Request, res: Response): Promise<void> {
    const trx = await SalariesModel.startTransaction()
    try {
      // Find the salary master record to update
      const salary_master = await SalaryMasterModel.query(trx).findOne({ id: req.params.salaryMasterId })
      if (!salary_master) {
        await trx.rollback()
        return ResponseHelper.error("Salary master not found", null, 404)(res)
      }

      // Find the associated salary record
      const salary = await SalariesModel.query(trx).findOne({ id: salary_master.salary_id })
      if (!salary) {
        await trx.rollback()
        return ResponseHelper.error("Salary not found", null, 404)(res)
      }

      // Calculate net salary
      const { basic_salary, bonus, deduction } = req.body
      const net_salary = basic_salary + bonus - deduction

      // Update salary
      await SalariesModel.query(trx)
        .patch({
          basic_salary,
          bonus,
          deduction,
          net_salary,
          updated_at: new Date(),
        })
        .where({ id: salary.id })

      // Find the salary history record to update
      const salary_history = await SalaryHistoryModel.query(trx).findOne({ id: salary_master.salary_history_id })
      if (!salary_history) {
        await trx.rollback()
        return ResponseHelper.error("Salary history not found", null, 404)(res)
      }

      // Update salary history
      await SalaryHistoryModel.query(trx)
        .patch({
          payment_date: req.body.payment_date,
          payment_method: req.body.payment_method,
          updated_at: new Date(),
        })
        .where({ id: salary_history.id })

      // Update salary master
      await SalaryMasterModel.query(trx)
        .patch({
          period_start: req.body.period_start,
          period_end: req.body.period_end,
          updated_at: new Date(),
        })
        .where({ id: salary_master.id })

      // Commit the transaction if all updates succeed
      await trx.commit()

      // Fetch the updated records
      const updatedSalary = await SalariesModel.query().findOne({ id: salary.id })
      const updatedSalaryHistory = await SalaryHistoryModel.query().findOne({ id: salary_master.salary_history_id })
      const updatedSalaryMaster = await SalaryMasterModel.query().findOne({ id: salary_master.id })

      const data = {
        gaji: {
          ...updatedSalary,
        },
        riwayat_gaji: {
          ...updatedSalaryHistory,
        },
        gaji_master: {
          ...updatedSalaryMaster,
        },
      }

      return ResponseHelper.success("Salary, Salary History, and Salary Master updated successfully", data, 200)(res)
    } catch (error) {
      await trx.rollback()
      return ErrorHelper.handler(error, res)
    }
  }
  async delete(req: Request, res: Response): Promise<void> {
    const trx = await SalaryMasterModel.startTransaction()
    try {
      // Find salary_master based on id
      const salaryMaster = await SalaryMasterModel.query(trx).findById(req.params.salaryMasterId)
      if (!salaryMaster) {
        await trx.rollback()
        return ResponseHelper.error("Salary master not found", null, 404)(res)
      }

      // Delete salary_master
      await SalaryMasterModel.query(trx).delete().where("id", req.params.salaryMasterId)

      // Then delete salary_history
      await SalaryHistoryModel.query(trx).delete().where("id", salaryMaster.salary_history_id)

      // Finally delete salary
      await SalariesModel.query(trx).delete().where("id", salaryMaster.salary_id)

      // Commit transaction
      await trx.commit()
      return ResponseHelper.success("Salary, Salary History, and Salary Master deleted successfully", null, 200)(res)
    } catch (error) {
      await trx.rollback()
      return ErrorHelper.handler(error, res)
    }
  }

  async getAllSalariesByEmployeeId(req: Request, res: Response): Promise<void> {
    const employeeId = req.params.employeeId

    try {
      // Find employee based on id
      const employee = await EmployeeModel.query().findById(employeeId)
      if (!employee) {
        return ResponseHelper.error("Employee not found", null, 404)(res)
      }

      //   Query salary by employee id and period
      const salaries = await SalaryMasterModel.query()
        .select("sm.period_start", "sm.period_end", "s.*", "sh.payment_date", "sh.payment_method")
        .from("salary_master as sm")
        .join("salaries as s", "sm.salary_id", "=", "s.id")
        .join("salary_history as sh", "sm.salary_history_id", "=", "sh.id")
        .where("sm.employee_id", employeeId)

      //   Fetch location
      const [province, city, district, subdistrict] = await Promise.all([
        fetchLocation(employee.province_id, "province"),
        fetchLocation(employee.city_id, "city", employee.province_id),
        fetchLocation(employee.district_id, "district", employee.city_id),
        fetchLocation(employee.subdistrict_id, "subdistrict", employee.district_id),
      ])

      //   Return response
      const responseData = {
        employee_id: employee.id,
        fullname: employee.fullname,
        no_hp: employee.no_hp,
        address: employee.address,
        subdistrict,
        district,
        city,
        province,
        position: employee.position,
        date_joined: employee.date_joined,
        status: employee.status,
        image: employee.image,
        bank_name: employee.bank_name,
        bank_account: employee.bank_account,
        created_at: employee.created_at,
        updated_at: employee.updated_at,
        gaji: salaries,
      }

      return ResponseHelper.success("Data fetched successfully", responseData, 200)(res)
    } catch (error) {
      return ResponseHelper.error("An error occurred", null, 500)(res)
    }
  }
}
