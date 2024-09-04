const Like = require('../models/Like');


async function likeLocation(req, res) {
    const place_id = req.params.id;

    console.log(place_id);


    try {
        const like = await Like.addLike(place_id);
        return res.status(200).json({ message: 'Location liked successfully', like });
    } catch (error) {
        console.error('Error adding like:', error);
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
}

async function getLikesByPlace(req, res) {
    const place_id = req.params.id;

    console.log(`Received request to get likes for place ${place_id}`);

    try {
        const likeCount = await Like.countLikesByPlaceId(place_id);
        
        console.log(`Successfully retrieved like count: ${likeCount}`);
        return res.status(200).json({ place_id, like_count: likeCount });
    } catch (error) {
        console.error('Error retrieving like count:', error);
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
}


async function removeLike(req, res) {
    const place_id = req.params.id;

    console.log(place_id);


    try {
        const like = await Like.removeLike(place_id);
        return res.status(200).json({ message: 'Location unliked successfully', like });
    } catch (error) {
        console.error('Error adding like:', error);
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
}



module.exports = {
    likeLocation,
    getLikesByPlace,
    removeLike
};
