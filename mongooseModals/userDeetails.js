const mongoose = require("mongoose");

const userModal = mongoose.Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("userModal", userModal);
