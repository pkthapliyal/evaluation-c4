const express = require("express");
const { UserModel } = require("../models/user.model")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
require("dotenv").config()
const sercretKey = process.env.sercretKey

const { logger } = require("../index")


const userRoute = express.Router();
userRoute.post("/register", async (req, res) => {

    try {
        const { name, email, pass } = req.body
        console.log(req.body)
        const isUser = UserModel.findOne({ email: email });
        const user = await UserModel(req.body)
        await user.save()
        res.status(200).send({ message: "user has been registered!" })
    } catch (error) {
        // console.log(error.message)
        logger.error(`${error.message}`)
        return res.status(404).send({ error: error.message })
    }
})

userRoute.post("/login", async (req, res) => {
    const { email, pass } = req.body


    const isUser = await UserModel.findOne({ email: email });
    console.log(isUser)
    if (isUser) {
        let token = jwt.sign({ user: isUser.email }, "secret", { expiresIn: "10m" })
        res.cookie("token", token)
        res.status(200).send({ message: "logegd in !" })
    }
    else {
        res.status(404).send({ error: "unauthorize " })
    }


})








module.exports = { userRoute }