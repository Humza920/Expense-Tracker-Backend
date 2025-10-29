const Expense = require("../models/Expense");
const xlsx = require("xlsx");

// Add Expense
exports.addExpense = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access. User not found in request.",
            });
        }

        const { icon, category, amount, date } = req.body;
        if (!icon || !category || !amount) {
            return res.status(400).json({ success: false, message: "Please fill all required fields" });
        }

        const expense = await Expense.create({
            userId,
            icon,
            category,
            amount,
            date
        });

        res.status(201).json({
            success: true,
            message: "Expense added successfully",
            expense,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get all Expenses
exports.getAllExpenses = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access. User not found in request.",
            });
        }

        const getExpenses = await Expense.find({ userId }).sort({ date: -1 });
        res.json(getExpenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Delete Expense
exports.deleteExpense = async (req, res) => {
    try {
        const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
        res.json(deletedExpense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Download Expenses Excel
exports.downloadExpenseExcel = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access. User not found in request.",
            });
        }

        let getExpenses = await Expense.find({ userId }).sort({ date: -1 });

        // Map to required fields
        getExpenses = getExpenses.map(expense => ({
            category: expense.category,
            amount: expense.amount,
            date: expense.date
        }));

        // Create workbook & sheet
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(getExpenses);
        xlsx.utils.book_append_sheet(wb, ws, "EXPENSES");

        // Write Excel file
        const filePath = "expense_details.xlsx";
        xlsx.writeFile(wb, filePath);

        // Send file to user
        res.download(filePath);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
