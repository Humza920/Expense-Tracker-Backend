const Income = require("../models/Income")
const xlsx = require("xlsx");

exports.addIncome = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access. User not found in request.",
            });
        }

        const { icon, source, amount, date } = req.body;
        if (!icon || !source || !amount) {
            return res.status(400).json({ success: false, message: "Please fill all required fields" });
        }
        const income = await Income.create({
            userId,
            icon,
            source,
            amount,
            date
        });

        res.status(201).json({
            success: true,
            message: "Income added Successful",
            income,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}
exports.getAllIncome = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access. User not found in request.",
            });
        }
        const getincomes = await Income.find({userId:userId}).sort({ date: -1 })

        
        res.json(getincomes);

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}
exports.deleteIncome = async (req, res) => {
    try {
        const deletedIncome = await Income.findByIdAndDelete(req.params.id)
        res.json(deletedIncome)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.downloadIncomeExcel = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access. User not found in request.",
            });
        }

        // Fetch user incomes and sort descending by date
        let getincomes = await Income.find({ user: userId }).sort({ date: -1 });

        // Map to only required fields
        getincomes = getincomes.map((income) => ({
            source: income.source,
            amount: income.amount,
            date: income.date
        }));

        // Create workbook & sheet
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(getincomes);
        xlsx.utils.book_append_sheet(wb, ws, "INCOME");

        // Write Excel file
        const filePath = "income_details.xlsx";
        xlsx.writeFile(wb, filePath);

        // Send file to user
        res.download(filePath);
        

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
