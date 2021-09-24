const express = require('express');
const router = express.Router();
const analysisController = require("../controllers/analysisController");

//router.get("/", mainController.index);
router.get("/analysis", analysisController.analysis);
router.post("/analysis", analysisController.check);


module.exports = router;