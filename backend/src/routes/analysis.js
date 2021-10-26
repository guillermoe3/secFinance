const express = require('express');
const router = express.Router();
const analysisController = require("../controllers/analysisController");

//router.get("/", mainController.index);
router.get("/investigations", analysisController.investigations);
router.get("/analysis", analysisController.analysis);
router.post("/analysis", analysisController.check);// analysisController.check);
router.post("/investigation", analysisController.create);


module.exports = router;