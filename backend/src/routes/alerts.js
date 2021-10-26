const express = require('express');
const router = express.Router();
const alertController = require("../controllers/alertController");
const alertDetailController = require("../controllers/alertDetailController");


router.get("/alerts", alertController.index);
router.post("/alert", alertController.create);

router.get("/alertDetail", alertDetailController.index);
router.post("/alertDetail", alertDetailController.create);



module.exports = router;