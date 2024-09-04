const { Router } = require("express");

const router = Router();

const factController = require('../controllers/interestingFacts.js');

router.get('/getFacts/:id', factController.getFacts);
router.get('/getInfoById/:id', factController.getInfoById);

module.exports = router;


