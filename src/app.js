const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/authRoutes")
const incomeRouter = require("./routes/incomeRoutes")
const expenseRouter = require("./routes/expenseRoutes")
const dashboardRouter = require("./routes/dashboardRoutes")


const app = express()
app.use(express.json())

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://expense-tracker-frontend-dj1s.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(cors({
    origin: "https://expense-tracker-frontend-dj1s.vercel.app",
    credentials:true
}))
app.use(cookieParser())
app.use("/api/auth" , authRouter)
app.use("/api/income" , incomeRouter)
app.use("/api/expense" , expenseRouter)
app.use("/api/dashboard" , dashboardRouter)



module.exports = app