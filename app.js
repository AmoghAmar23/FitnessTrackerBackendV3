require("dotenv").config()
const express = require("express")
const app = express()
const routes = require("./api")

// Setup your Middleware and API Router here
app.use(express.json())
app.use("/api", routes)

module.exports = app;
