const { Router } = require("express");
const authenticator = require('../middleware/authenticator');


const router = Router();
const analysisController = require('../controllers/analysisController');


router.get('/user-recommendations', authenticator, analysisController.getRecommendationCount);
router.get('/user-visits', authenticator, analysisController.getVisitCount);


module.exports = router;