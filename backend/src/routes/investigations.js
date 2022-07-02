const express = require('express');
const router = express.Router();
const analysisController = require("../controllers/investigationController");


router.get("/investigations", analysisController.getAll);
router.get("/investigations/:user/:id", analysisController.getById);
router.get("/investigations/:user", analysisController.getByUserId);
router.post("/investigation", analysisController.create);

module.exports = router;