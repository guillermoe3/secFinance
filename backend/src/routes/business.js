const express = require('express');
const router = express.Router();
const businessController = require("../controllers/businessController");


router.get("/business", businessController.getAll);
router.post("/business", businessController.create);



module.exports = router;