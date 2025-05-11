const express = require("express");
const { generateCV, getTemplates } = require("../controller/cvController");

const router = express.Router();

router.post("/generate", generateCV);

module.exports = router;
