const { Router } = require("express");

const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');


router.get('/most-liked', analysisController.getMostLikedPlaces);
router.get('/most-saved', analysisController.getMostSavedPlaces);
router.get('/most-recommended', analysisController.getMostRecommendedPlaces);
router.get('/combined-metrics', analysisController.getCombinedMetrics);
router.get('/renewed-combined-metrics', analysisController.getRenewedCombinedMetrics);


module.exports = router;