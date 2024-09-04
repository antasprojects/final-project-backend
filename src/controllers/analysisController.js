const {getRecommendationCountDB, getVisitCountDB} = require('../models/Analysis');


async function getRecommendationCount(req, res) {
    try {
        const data = await getRecommendationCountDB(req.user_id);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function getVisitCount(req, res) {
    try {

        const data = await getVisitCountDB(req.user_id);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {

    getVisitCount,
    getRecommendationCount

}