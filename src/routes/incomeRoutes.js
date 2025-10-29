const express =  require("express")
const {protect} = require("../middlewares/auth")
const { addIncome, getAllIncome, downloadIncomeExcel, deleteIncome } = require("../controllers/incomeController")
const incomeRouter = express.Router()

incomeRouter.post("/add" , protect , addIncome)
incomeRouter.get("/get" , protect , getAllIncome)
incomeRouter.get("/downloadexcel" , protect , downloadIncomeExcel)
incomeRouter.delete("/:id" , protect , deleteIncome)

module.exports = incomeRouter