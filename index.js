const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const userModal = require("./mongooseModals/userDeetails");
const expenseModal = require("./mongooseModals/expense");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const bankExpense = require("./mongooseModals/bankTransaction");
var jwt = require("jsonwebtoken");

const app = express();
const port = 5678;
app.use(bodyParser.json());

mongoose.connect(
  "mongodb+srv://delhi93rsharma:XWlifv4AcKiUe99i@project00.vgacull.mongodb.net/?retryWrites=true&w=majority&appName=Project00"
);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// registration process

app.post("/register", async (req, res) => {
  const { userName, password } = req.body;

  if (userName && password) {
    const isNewUser = await userModal?.findOne({ userName });

    console.log(isNewUser, "isNewUserisNewUser");
    if (isNewUser === null) {
      const encrptPasword = await bcrypt.hash(password, saltRounds);

      if (!!encrptPasword) {
        const userCreated = await userModal?.create({
          userName,
          password: encrptPasword,
        });

        if (!!userCreated?._id) {
          res.status(200).json({
            message: "user Created Successfully",
            status: 200,
            userName,
          });
        } else {
          res
            .status(213)
            .json({ message: "User can not be created", status: 213 });
        }
      } else {
        res.status(212).json({ message: "encryption Failed", status: 212 });
      }
    } else {
      res.status(210).json({ message: "User Already Exist", status: 210 });
    }
  } else {
    res.status(209).json({
      message: "Validation Error , Mandatory Fields Missing",
      status: 209,
    });
  }
});

// Login Process

app.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  const isUserAlreadyRegistered = await userModal.findOne({ userName });

  if (!!isUserAlreadyRegistered?.id) {
    // console.log("Exit");
    const isPasswordMatched = await bcrypt.compare(
      password,
      isUserAlreadyRegistered?.password
    );
    if (!!isPasswordMatched) {
      const token = jwt.sign(
        {
          data: isUserAlreadyRegistered?.userName,
        },
        "poize1993",
        { expiresIn: "10h" }
      );
      res
        .status(200)
        .json({ token, userName, status: 200, message: "LogIn Successfull" });
    } else {
      res.status(221).json({ message: "Incorrect Password", status: 221 });
    }
  } else {
    res.status(220).json({ message: "user Does notExist", status: 220 });
  }
});

// adding expense
app.post("/addExpense", async (req, res) => {
  const { amount, reason, date, isFuel, userName } = req.body;

  try {
    const expense = await expenseModal?.create({
      amount,
      reason,
      date,
      isFuel,
      userName,
    });

    res.status(200).json(expense);
  } catch (err) {
    res.status(210).json({ message: "Failed Atempt", status: 210 });
    console.log(err);
  }

  // console.log(expense, "ggg");
});

app.get("/getAllExpenses", async (req, res) => {
  console.log(req?.query?.userName, "reqreq");

  try {
    const allExpenses = await expenseModal.find({
      userName: req?.query?.userName,
    });
    res.status(200).json(allExpenses.reverse());
  } catch (err) {
    es.status(200).json({ message: err });
    console.log(err);
  }
});

app.post("/addTransaction", async (req, res) => {
  const { date, account, category, reason, amount, userName } = req.body;

  try {
    const expense = await bankExpense?.create({
      date,
      account,
      category,
      reason,
      amount,
      userName,
    });

    res.status(200).json(expense);
    console.log(expense, "expense");
  } catch (err) {
    res.status(210).json({ message: "Failed Atempt", status: 210 });
    console.log(err);
  }
});

app.get("/getAllBankExpenses", async (req, res) => {
  try {
    const allExpenses = await bankExpense.find({
      userName: req?.query?.userName,
    });
    res.status(200).json(allExpenses.reverse());
  } catch (err) {
    es.status(200).json({ message: err });
    console.log(err);
  }
});

app.listen(port, () => console.log(`Listeing to ${port}`));
