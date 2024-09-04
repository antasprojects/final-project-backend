const { Router } = require("express");

const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');


router.get('/user-recommendations', analysisController.getUserRecommendationCounts);
router.get('/user-visits', analysisController.getUserVisitCounts);


module.exports = router;