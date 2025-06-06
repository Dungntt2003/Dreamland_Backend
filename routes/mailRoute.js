const express = require("express");
const route = express.Router();
const { sendEmail } = require("../controllers/mailController");

route.post("/", sendEmail);

module.exports = route;
