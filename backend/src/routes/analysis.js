const express = require('express');
const router = express.Router();
const analysisController = require("../controllers/analysisController");



//router.get("/analysis", analysisController.analysis);
router.post("/analysis", analysisController.check);
router.get("/analysis", analysisController.getAll);
router.get("/analysis/:id", analysisController.getAllbyInvestigation);
router.put("/analysis/:id", analysisController.update);
router.delete("/analysis/:id", analysisController.delete);



module.exports = router;