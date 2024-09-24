import { authenticateToken } from "../middlewares/authorizations"
import { UserController } from "../controllers/user.controller"
import { Router } from "express"

const userController = new UserController()

const router = Router()

// Register
router.post("/register", userController.register)
// Login
router.post("/login", userController.login)
// Who am I
router.get("/me", authenticateToken, userController.whoAmI.bind(userController))
// Refresh Token
router.post("/refresh-token", userController.refreshToken.bind(userController))
// Logout
router.post("/logout", authenticateToken, userController.logout.bind(userController))

export default router
