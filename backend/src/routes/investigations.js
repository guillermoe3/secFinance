const express = require('express');
const router = express.Router();
const analysisController = require("../controllers/investigationController");


router.get("/investigations", analysisController.getAll);

router.get("/investigations/barChart", analysisController.getInfoBarChart);

router.get("/investigations/:user/:id", analysisController.getById);
router.get("/investigations/:user", analysisController.getByUserId);
router.post("/investigation", analysisController.create);
router.post("/investigation/:id/update", analysisController.update);
router.get("/investigation/:id/closed", analysisController.isClosed)

router.get("/investigation/:id/requested", analysisController.isRequested)

router.get("/investigation/:id/validated", analysisController.isValidated)

router.get("/investigation/toreview", analysisController.toReview)

router.get("/investigation/myreview/:id", analysisController.myReviews)

router.get("/investigation/statistics/:id", analysisController.getStatistics)

router.get("/investigation/:id/commented", analysisController.isCommented)


module.exports = router;