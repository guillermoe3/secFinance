const express = require('express');
const router = express.Router();
const mainController = require("../controllers/mainController");

router.get("/", mainController.index);
router.get("/index", mainController.index);
//router.get("/analysis", mainController.check);


module.exports = router;