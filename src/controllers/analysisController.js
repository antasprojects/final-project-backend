const analysisModel = require('../models/Analysis');


async function getMostLikedPlaces(req, res) {
    try {
        const data = await analysisModel.getMostLikedPlaces();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function getMostSavedPlaces(req, res) {
    try {
        const data = await analysisModel.getMostSavedPlaces();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function getMostRecommendedPlaces(req, res) {
    try {
        const data = await analysisModel.getMostRecommendedPlaces();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function getCombinedMetrics(req, res) {
    try {
        const data = await analysisModel.getCombinedMetrics();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function getRenewedCombinedMetrics(req, res) {
    try {
        const data = await analysisModel.getRenewedCombinedMetrics();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports ={ 
    
    getMostLikedPlaces,
    getMostSavedPlaces,
    getMostRecommendedPlaces,
    getCombinedMetrics,
    getRenewedCombinedMetrics
}