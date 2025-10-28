const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/authRoutes")
const app = express()
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}))
app.use(cookieParser())
app.use("/api/auth" , authRouter)

module.exports = app