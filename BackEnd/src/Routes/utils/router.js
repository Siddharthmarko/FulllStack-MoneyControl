const express = require("express");
const router = express.Router();
const path = require("path");
const home = require(path.join(__dirname, "../Home/home.js"));

router.use(home);

module.exports = router;
