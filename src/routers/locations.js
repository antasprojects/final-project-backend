const { Router } = require("express");

const locationsController = require("../controllers/locations.js");

const locationsRouter = Router();

locationsRouter.get("/data/:id", locationsController.show);
locationsRouter.get("/images/:id", locationsController.showImages);
locationsRouter.get("/image/:id", locationsController.showImage);
locationsRouter.get("/description/:id", locationsController.showDescription)
locationsRouter.get("/weather/:id", locationsController.showWeather);
locationsRouter.post("/filter", locationsController.showFiltered);
locationsRouter.post("/recommendations", locationsController.showRecommendations);

// New route to get metrics for a location (save count)
locationsRouter.get("/metrics/:place_id", locationsController.getPlaceMetrics);

// New route to get recommendation metrics for a location
locationsRouter.get("/recommendation-metrics/:place_id", locationsController.getRecommendationMetrics);

module.exports = locationsRouter;
