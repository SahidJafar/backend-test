import { UsersModel } from "../databases/models/users"
import { ErrorHelper } from "../helpers/error.helper"
import { ResponseHelper } from "../helpers/response.helper"
import { comparePassword, hashPassword } from "../utils/bcrypt.password"
import { createRefreshToken, createToken } from "../utils/token"
import { Request, Response } from "express"
import { v4 as uuidv4 } from "uuid"

export class UserController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      // Check if user already exists
      const existingUser = await UsersModel.query().findOne({ email: req.body.email })
      if (existingUser) {
        return ResponseHelper.error("User with this email already exists", null, 401)(res)
      }

      // Hash password
      const passwordHashed = await hashPassword(req.body.password)

      //id = uuid
      req.body.id = uuidv4()

      // Insert user data to database
      const user = await UsersModel.query().insert({
        ...req.body,
        password: passwordHashed,
      })

      return ResponseHelper.success("Data inserted successfully", user, 200)(res)
    } catch (error) {
      return ErrorHelper.handler(error, res)
    }
  }
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body
      const user = await UsersModel.query().findOne({ email })

      if (!user) {
        return ResponseHelper.error("User not found", null, 404)(res)
      }

      const isPasswordCorrect = await comparePassword(password, user.password)

      if (!isPasswordCorrect) {
        return ResponseHelper.error("Incorrect password", null, 401)(res)
      }

      // Create Token
      const token = createToken({
        id: user.id,
        name: user.name,
        email: user.email,
      })

      //   Create Refresh Token
      const refreshToken = createRefreshToken({
        id: user.id,
        name: user.name,
        email: user.email,
      })

      // Update Token and Refresh Token
      await UsersModel.query().update({
        token: token,
        refresh_token: refreshToken,
      })

      //  Map user without password
      const { password: userPassword, ...userWithoutPassword } = user

      // Filtered User
      const filteredUser = {
        id: userWithoutPassword.id,
        name: userWithoutPassword.name,
        email: userWithoutPassword.email,
        token: token,
        refresh_token: refreshToken,
      }

      return ResponseHelper.success("Login successfully", { user: filteredUser }, 200)(res)
    } catch (error) {
      return ErrorHelper.handler(error, res)
    }
  }

  async whoAmI(req: Request, res: Response): Promise<void> {
    try {
      const { password, ...userWithoutPassword } = req.user

      ResponseHelper.success("User data found", userWithoutPassword, 200)(res)
    } catch (error) {
      return ErrorHelper.handler(error, res)
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.body.refresh_token

      const user = await UsersModel.query().findOne({ refresh_token: refreshToken })

      if (!user || !user.id) {
        return ResponseHelper.error("User not found or ID is undefined", null, 404)(res)
      }

      const token = createToken({
        id: user.id,
        name: user.name,
        email: user.email,
      })

      await UsersModel.query().update({ token }).where({ id: user.id }).skipUndefined()

      return ResponseHelper.success("Token refreshed successfully", { token }, 200)(res)
    } catch (error) {
      console.error("Error refreshing token:", error) // Improved error logging
      return ErrorHelper.handler(error, res)
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user

      await UsersModel.query().update({ token: "", refresh_token: "" }).where({ id: user.id })

      return ResponseHelper.success("Logout successfully", null, 200)(res)
    } catch (error) {
      return ErrorHelper.handler(error, res)
    }
  }
}
