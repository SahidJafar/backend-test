import swaggerAutogen from "swagger-autogen"

const doc = {
  info: {
    title: "Payroll API",
    version: "1.0.0",
    description: "Welcome to Payroll API",
    contact: {
      name: "Sahid Jafar",
    },
  },
  host: "localhost:8000",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
    },
  },
}

const outputFile = "./swagger.json"
const endpointsFiles = ["./src/routes/index.ts"]

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  //   import("./src/app");
})
