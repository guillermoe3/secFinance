const express = require('express');
const router = express.Router();
const businessController = require("../controllers/businessController");


router.get("/business", businessController.getAll);
router.post("/business", businessController.create);

router.get("/business/:id", businessController.getNameById)



module.exports = router;