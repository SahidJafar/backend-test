import { authenticateToken } from "../middlewares/authorizations"
import { Router } from "express"
import { EmployeeController } from "../controllers/employee.controller"
import upload from "../utils/upload.on.memory"

const employeeController = new EmployeeController()

const router = Router()

// Create
router.post("/", authenticateToken, upload.single("image"), employeeController.create.bind(employeeController))
// Update
router.put("/:id", authenticateToken, upload.single("image"), employeeController.update.bind(employeeController))
// Delete
router.delete("/:id", authenticateToken, employeeController.delete.bind(employeeController))
// Get List
router.get("/", authenticateToken, employeeController.getAll.bind(employeeController))
// Get By Id
router.get("/:id", authenticateToken, employeeController.getEmployeeById.bind(employeeController))

export default router
