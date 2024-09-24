import { Router, Request, Response } from "express"
import userRouter from "./userRouter"
import employeeRouter from "./employeeRouter"
import salaryRouter from "./salaryRouter"

const router = Router()

router.use("/api/v1/users", userRouter)
router.use("/api/v1/employees", employeeRouter)
router.use("/api/v1/salaries", salaryRouter)

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    code: 200,
    status: "success",
    message: "Welcome to Payroll API",
    data: null,
  })
})

router.use((req: Request, res: Response) => {
  res.status(404).json({
    code: 404,
    status: "error",
    message: "Route not found",
    data: null,
  })
})

export default router
