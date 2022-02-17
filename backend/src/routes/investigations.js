const express = require('express');
const router = express.Router();
const analysisController = require("../controllers/investigationController");


router.get("/investigations", analysisController.getAll);
router.get("/investigations/:id", analysisController.getById);
router.post("/investigation", analysisController.create);

module.exports = router;