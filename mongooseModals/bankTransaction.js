const mongoose = require("mongoose");

const bankExpense = mongoose.Schema({
  date: { type: String, required: true },
  account: { type: String, required: true },
  category: { type: String, required: true },
  reason: { type: String, required: true },
  amount: { type: String, required: true },
  userName: { type: String, required: true },
});

module.exports = mongoose.model("bankExpense", bankExpense);
