const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/authRoutes")
const incomeRouter = require("./routes/incomeRoutes")
const expenseRouter = require("./routes/expenseRoutes")
const dashboardRouter = require("./routes/dashboardRoutes")


const app = express()
app.use(express.json())

app.use(
  cors({
    origin: [
      "https://expense-tracker-frontend-seven-lyart.vercel.app",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);


app.use(cookieParser())
app.use("/api/auth", authRouter)
app.use("/api/income", incomeRouter)
app.use("/api/expense", expenseRouter)
app.use("/api/dashboard", dashboardRouter)



module.exports = app