const express = require("express");
const { UserModel } = require("../models/user.model")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
require("dotenv").config()
const sercretKey = process.env.sercretKey
const cookieParser = require("cookie-parser")
const axios = require("axios")
const redis = require("redis");
const { AssertionError } = require("assert");
const weatherRoute = express.Router()

require("winston-mongodb")
const winston = require("winston");

const client = redis.createClient();
client.connect()

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



weatherRoute.get("/weather/:city", async (req, res) => {
    const city = req.params.city
    console.log(city)
    const isCity = await client.get(city)
    if (isCity) {
        return res.send(JSON.parse(isCity))
    }
    try {
        const weather = await axios.get(`https://api.weatherapi.com/v1/current.json?key=391323bc2cba4e04a9a101855231206&q=${city}&aqi=no`)
        data = await weather
        console.log(data.data)
        // "391323bc2cba4e04a9a101855231206"
        let store = data.data

        client.setEx(city, 1800, JSON.stringify(store))
        res.send(data.data)

    } catch (error) {
        logger.error(`${error.message}`)

        console.log(error.message)
        res.send(error.message)
    }
})


module.exports = { weatherRoute }





