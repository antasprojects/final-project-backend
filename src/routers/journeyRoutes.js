const { Router } = require("express");
const express = require('express');
const { getJourneyDirections } = require('../controllers/journeyController');

const router = express.Router();


router.post('/directions', getJourneyDirections);

module.exports = router;