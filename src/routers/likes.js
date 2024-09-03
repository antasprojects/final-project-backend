
const { Router } = require("express");
const express = require('express');
const { likeLocation, getLikesByPlace } = require('../controllers/likes');

const router = express.Router();

module.exports = router;


router.post('/places/:place_id/like', likeLocation);
router.get('/places/:place_id/likes', getLikesByPlace);