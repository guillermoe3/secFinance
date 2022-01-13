const express = require('express');
const router = express.Router();
const analysisController = require("../controllers/analysisController");

//router.get("/", mainController.index);
router.get("/investigations", analysisController.investigations);
router.get("/analysis", analysisController.analysis);
//router.post("/analysis", analysisController.check);
router.post("/analysis", analysisController.check2);
router.post("/investigation", analysisController.create);

//router.get("/all", analysisController.test)


module.exports = router;