const express = require("express");
const bitacoraController = require("../controllers/bitacoraController");

const router = express.Router();
//verifyToken, 
router.get('/events', bitacoraController.getEvents);

router.post("/events/create", bitacoraController.createEvent)

 
module.exports = router;