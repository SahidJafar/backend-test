import { Router } from "express"
import { SalaryController } from "../controllers/salary.controller"
import { authenticateToken } from "../middlewares/authorizations"

const salaryController = new SalaryController()

const router = Router()

// Create
router.post("/", authenticateToken, salaryController.create.bind(salaryController))
// Update
router.put("/:salaryMasterId", authenticateToken, salaryController.update.bind(salaryController))
// Delete
router.delete("/:salaryMasterId", authenticateToken, salaryController.delete.bind(salaryController))
// Get salary by employee id
router.get("/:employeeId", authenticateToken, salaryController.getAllSalariesByEmployeeId.bind(salaryController))

export default router
