const express = require("express");
const router = express.Router();
const triviaRoutes = require("./trivia");

router.use(express.json());
router.use("/trivia", triviaRoutes);

module.exports = router;
