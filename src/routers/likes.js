
const { Router } = require("express");
const likesController = require('../controllers/likes');

const router = Router();

module.exports = router;

router.get('/places/:id/like', likesController.likeLocation);
router.get('/places/:id/likes', likesController.getLikesByPlace);
router.get('/places/:id/dislike',likesController.removeLike);