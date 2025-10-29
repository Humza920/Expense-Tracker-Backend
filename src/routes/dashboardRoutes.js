const express =  require("express")
const {protect} = require("../middlewares/auth")
const {getDashboardData} = require("../controllers/dashboardController")
const dashboardRouter = express.Router()

dashboardRouter.get("/" , protect , getDashboardData)

module.exports = dashboardRouter