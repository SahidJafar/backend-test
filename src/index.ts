import express, { Express } from "express"
import { config } from "dotenv"
import router from "./routes"
import { Model } from "objection"
import knexInstance from "./config/database"
import cors from "cors"
import swaggerUi from "swagger-ui-express"
import swagggerDocument from "../swagger.json"

config()

const app: Express = express()
const PORT = process.env.PORT || 3000

Model.knex(knexInstance)

// Use CORS middleware
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static("public"))
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagggerDocument))
app.use(router)

app.listen(PORT, () => {
  console.log(`Express is listening at http://localhost:${PORT}`)
})
