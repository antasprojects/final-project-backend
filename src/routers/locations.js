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

// New route to get metrics for a location
locationsRouter.get("/metrics/:place_id", locationsController.getPlaceMetrics);

module.exports = locationsRouter;
