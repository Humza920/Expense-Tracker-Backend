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
        const getincomes = await Income.find({ userId: userId }).sort({ date: -1 })


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
const xlsx = require("xlsx");
const { Income } = require("../models/Income");

exports.downloadIncomeExcel = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access. User not found in request.",
      });
    }

    let getIncomes = await Income.find({ userId }).sort({ date: -1 });
    getIncomes = getIncomes.map((income) => ({
      source: income.source,
      amount: income.amount,
      date: income.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(getIncomes);
    xlsx.utils.book_append_sheet(wb, ws, "INCOME");

    // Generate Excel file in memory
    const excelBuffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    // ✅ Set CORS headers manually before sending the file
    res.setHeader("Access-Control-Allow-Origin", "https://expense-tracker-frontend-dj1s.vercel.app");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=income_details.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(excelBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


