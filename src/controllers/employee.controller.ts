import { fetchLocation } from "../utils/fetch.location"
import { EmployeeModel } from "../databases/models/employees"
import { ErrorHelper } from "../helpers/error.helper"
import { ResponseHelper } from "../helpers/response.helper"
import { Request, Response } from "express"
import { v4 as uuidv4 } from "uuid"
import path from "path"

export class EmployeeController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { fullname, no_hp, address, province_id, city_id, district_id, subdistrict_id, position, date_joined, status, bank_name, bank_account } = req.body
      const existingEmployee = await EmployeeModel.query().findOne({ fullname: fullname })

      if (existingEmployee) {
        if (req.file) {
          const fs = require("fs")
          const filePath = path.resolve(__dirname, "../public/uploads", req.file.filename)
          fs.unlinkSync(filePath)
        }
        return ResponseHelper.error("Employee already exists", null, 401)(res)
      }

      if (!fullname || !no_hp || !address || !province_id || !city_id || !district_id || !subdistrict_id || !position || !date_joined || !status) {
        if (req.file) {
          const fs = require("fs")
          const filePath = path.resolve(__dirname, "../public/uploads", req.file.filename)
          fs.unlinkSync(filePath)
        }
        return ResponseHelper.error("All fields are required", null, 400)(res)
      }

      const [province, city, district, subdistrict] = await Promise.all([
        fetchLocation(province_id, "province"),
        fetchLocation(city_id, "city", province_id),
        fetchLocation(district_id, "district", city_id),
        fetchLocation(subdistrict_id, "subdistrict", district_id),
      ])

      if (!province || !city || !district || !subdistrict) {
        if (req.file) {
          const fs = require("fs")
          const filePath = path.resolve(__dirname, "../public/uploads", req.file.filename)
          fs.unlinkSync(filePath)
        }
        return ResponseHelper.error("Location not found", null, 404)(res)
      }

      let image: string | null = null
      if (req.file) {
        image = req.file.filename
      }

      const employee = await EmployeeModel.query().insert({
        ...req.body,
        image: image,
        id: uuidv4(),
      })

      return ResponseHelper.success("Data inserted successfully", employee, 201)(res)
    } catch (error) {
      return ErrorHelper.handler(error, res)
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id
      const employeeById = await EmployeeModel.query().findOne({ id: id })
      if (!employeeById) {
        if (req.file) {
          const fs = require("fs")
          const filePath = path.resolve(__dirname, "../public/uploads", req.file.filename)
          fs.unlinkSync(filePath)
        }
        return ResponseHelper.error("Employee not found", null, 404)(res)
      }

      const { fullname, no_hp, address, province_id, city_id, district_id, subdistrict_id, position, date_joined, status, bank_name, bank_account } = req.body

      if (!fullname || !no_hp || !address || !province_id || !city_id || !district_id || !subdistrict_id || !position || !date_joined || !status) {
        if (req.file) {
          const fs = require("fs")
          const filePath = path.resolve(__dirname, "../public/uploads", req.file.filename)
          fs.unlinkSync(filePath)
        }
        return ResponseHelper.error("All fields are required", null, 400)(res)
      }

      const [province, city, district, subdistrict] = await Promise.all([
        fetchLocation(province_id, "province"),
        fetchLocation(city_id, "city", province_id),
        fetchLocation(district_id, "district", city_id),
        fetchLocation(subdistrict_id, "subdistrict", district_id),
      ])

      if (!province || !city || !district || !subdistrict) {
        if (req.file) {
          const fs = require("fs")
          const filePath = path.resolve(__dirname, "../public/uploads", req.file.filename)
          fs.unlinkSync(filePath)
        }
        return ResponseHelper.error("Location not found", null, 404)(res)
      }

      if (employeeById?.image) {
        const fs = require("fs")
        const filePath = path.resolve(__dirname, "../public/uploads", employeeById.image)
        fs.unlinkSync(filePath)
      }

      let image: string | null = null
      if (req.file) {
        image = req.file.filename
      }

      const employee = await EmployeeModel.query().patchAndFetchById(id, {
        ...req.body,
        image: image,
      })

      return ResponseHelper.success("Data updated successfully", employee, 200)(res)
    } catch (error) {
      return ErrorHelper.handler(error, res)
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id
      const employeeById = await EmployeeModel.query().findOne({ id: id })
      if (employeeById?.image) {
        const fs = require("fs")
        const filePath = path.resolve(__dirname, "../public/uploads", employeeById.image)
        fs.unlinkSync(filePath)
      }

      const employee = await EmployeeModel.query().deleteById(id)
      if (!employee) {
        return ResponseHelper.error("Employee not found", null, 404)(res)
      } else {
        return ResponseHelper.success("Data deleted successfully", null, 200)(res)
      }
    } catch (error) {
      return ErrorHelper.handler(error, res)
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const employees = await EmployeeModel.query()

      // Create an array of promises to fetch location data for each employee
      const employeePromises = employees.map(async (employee) => {
        const province = await fetchLocation(employee.province_id, "province")
        const city = await fetchLocation(employee.city_id, "city", employee.province_id)
        const district = await fetchLocation(employee.district_id, "district", employee.city_id)
        const subdistrict = await fetchLocation(employee.subdistrict_id, "subdistrict", employee.district_id)

        return {
          id: employee.id,
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
        }
      })

      const employeesWithLocations = await Promise.all(employeePromises)

      return ResponseHelper.success("Data fetched successfully", employeesWithLocations, 200)(res)
    } catch (error) {
      return ErrorHelper.handler(error, res)
    }
  }

  async getEmployeeById(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id
      const employee = await EmployeeModel.query().findOne({ id: id })

      if (!employee) {
        return ResponseHelper.error("Employee not found", null, 404)(res)
      }

      const [province, city, district, subdistrict] = await Promise.all([
        fetchLocation(employee.province_id, "province"),
        fetchLocation(employee.city_id, "city", employee.province_id),
        fetchLocation(employee.district_id, "district", employee.city_id),
        fetchLocation(employee.subdistrict_id, "subdistrict", employee.district_id),
      ])

      const data = {
        id: employee.id,
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
      }

      return ResponseHelper.success("Data fetched successfully", data, 200)(res)
    } catch (error) {
      return ErrorHelper.handler(error, res)
    }
  }
}
