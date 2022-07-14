const express = require('express');
const router = express.Router();
const alertController = require("../controllers/alertController");



router.get("/alerts", alertController.getAll);
router.get("/alerts/business/:id", alertController.getAlertsByIdBusiness);
router.post("/alerts", alertController.create);





module.exports = router;