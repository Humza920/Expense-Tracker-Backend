const Expense = require("../models/Expense");
const Income = require("../models/Income");
const { Types } = require("mongoose");

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access. User not found in request",
            });
        }

        if (!Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        const userObjectId = new Types.ObjectId(String(userId));

        // Total Income
        const totalIncomeData = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, totalIncome: { $sum: "$amount" } } }
        ]);

        const totalIncome = totalIncomeData[0]?.totalIncome || 0;

        // Total Expense
        const totalExpenseData = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, totalExpense: { $sum: "$amount" } } }
        ]);

        const totalExpense = totalExpenseData[0]?.totalExpense || 0;

        // Last 30 days date
        const past30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        // Last 30 days Income Transactions
        const last30DaysIncomeTransactions = await Income.find({
            userId: userObjectId,
            date: { $gte: past30Days }
        }).sort({ date: -1 })

        // Last 30 days Expense Transactions
        const last30DaysExpenseTransactions = await Expense.find({
            userId: userObjectId,
            date: { $gte: past30Days }
        }).sort({ date: -1 })

        // Response
        res.json({
            success: true,
            data: {
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense,
                last30DaysIncomeTransactions,
                last30DaysExpenseTransactions
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
