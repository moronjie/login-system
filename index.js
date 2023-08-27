require("dotenv").config()
const express = require('express')
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser")
const morgan = require('morgan')
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const connect = require("./model/connect")
const userRoute = require("./routers/user")

app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())
app.use(morgan("common"))

//routers middleware
app.use("/user", userRoute)

connect(process.env.DB)

const port = process.env.PORT || 3000

mongoose.connection.on("error", () => console.log("something went wrong "))

mongoose.connection.once("open", () => {
    app.listen(port, () => console.log(`app is running at port ${port}`))
})
