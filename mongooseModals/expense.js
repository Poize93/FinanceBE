const mongoose = require("mongoose");

const expenseModal = mongoose.Schema({
  amount: { type: String, require: true },
  reason: { type: String, require: true },
  date: { type: String, require: true },
  isFuel: { type: Number, require: true },
  userName: { type: String, require: true },
});

module.exports = mongoose.model("expenseModal", expenseModal);
