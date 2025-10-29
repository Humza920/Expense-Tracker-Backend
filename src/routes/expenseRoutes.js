const express =  require("express")
const {protect} = require("../middlewares/auth")
const { addExpense, getAllExpense, downloadExpenseExcel, deleteExpense } = require("../controllers/expenseController")
const expenseRouter = express.Router()

expenseRouter.post("/add" , protect , addExpense)
expenseRouter.get("/get" , protect ,getAllExpense)
expenseRouter.get("/downloadexcel" , protect , downloadExpenseExcel)
expenseRouter.delete("/:id" , protect , deleteExpense)

module.exports = expenseRouter