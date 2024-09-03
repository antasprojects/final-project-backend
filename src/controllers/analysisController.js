const analysisModel = require('../models/Analysis');


async function getUserRecommendationCounts(req, res) {
    try {
        const data = await metricsModel.getUserRecommendationCounts();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function getUserVisitCounts(req, res) {
    try {
        const data = await metricsModel.getUserVisitCounts();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {

    getUserVisitCounts,
    getUserRecommendationCounts

}