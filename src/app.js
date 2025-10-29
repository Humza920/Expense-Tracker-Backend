const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/authRoutes")
const incomeRouter = require("./routes/incomeRoutes")
const expenseRouter = require("./routes/expenseRoutes")

const app = express()
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5175",
    credentials:true
}))
app.use(cookieParser())
app.use("/api/auth" , authRouter)
app.use("/api/income" , incomeRouter)
app.use("/api/expense" , expenseRouter)



module.exports = app