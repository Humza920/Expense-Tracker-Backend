const express =  require("express")
const {protect} = require("../middlewares/auth")
const { addExpense, getAllExpense, downloadExpenseExcel, deleteExpense } = require("../controllers/incomeController")
const incomeRouter = express.Router()

incomeRouter.post("/add" , protect , addExpense)
incomeRouter.get("/get" , protect ,getAllExpense)
incomeRouter.get("/downloadexcel" , protect , downloadExpenseExcel)
incomeRouter.delete("/:id" , protect , deleteExpense)

module.exports = incomeRouter