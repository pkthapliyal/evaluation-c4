const express = require("express");
const PORT = 8080;
const winston = require("winston");
const cookieParser = require("cookie-parser")
require("dotenv").config();
require("winston-mongodb")

const app = express()
app.use(express.json())
const { userRoute } = require('./routes/user.route')
const { weatherRoute } = require('./routes/weather.route')

app.use("/user", userRoute)
app.use("/", weatherRoute)


// https://api.weatherstack.com/current?access_key=da92266b18638766b9dc7dc354a090e4&query=${city}`
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            level: "info",
            filename: "infolog.log",
            format: winston.format.combine(winston.format.timestamp(), winston.format.json())
        }),
        new winston.transports.MongoDB({
            level: "error",
            db: process.env.mongoURl,
            options: { useUnifiedTopology: true },
            collection: "logger",
            format: winston.format.combine(winston.format.timestamp(), winston.format.json())
        })
    ],
    format: winston.format.combine(winston.format.timestamp(), winston.format.json())
})

app.use((req, res, next) => {
    logger.info("Requested something")
    next()
})

const { connection } = require("./db")
app.listen(PORT, async () => {
    try {
        await connection;
        console.log("server is listening at 8080")
    } catch (error) {
        console.log(error.message)
    }
})

module.exports = { logger }