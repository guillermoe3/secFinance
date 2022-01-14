const express = require('express');
const router = express.Router();
const analysisController = require("../controllers/investigationController");


router.get("/investigations", analysisController.investigations);
router.post("/investigation", analysisController.create);

module.exports = router;