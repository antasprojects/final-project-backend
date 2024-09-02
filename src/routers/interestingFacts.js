const { Router } = require("express");
const express = require('express');
const router = express.Router();

const factController = require('../controllers/interestingFacts.js');

router.post('/getFacts/:id', factController.getFacts);
router.get('/getInfoById/:id', factController.getInfoById);

module.exports = router;


