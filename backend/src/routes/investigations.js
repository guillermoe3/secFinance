const express = require('express');
const router = express.Router();
const analysisController = require("../controllers/investigationController");


router.get("/investigations", analysisController.getAll);
router.get("/investigations/:user/:id", analysisController.getById);
router.get("/investigations/:user", analysisController.getByUserId);
router.post("/investigation", analysisController.create);
router.post("/investigation/:id/update", analysisController.update);
router.get("/investigation/:id/closed", analysisController.isClosed)


module.exports = router;