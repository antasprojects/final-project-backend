const { Router } = require("express");

const locationsController = require("../controllers/locations.js");


const locationsRouter = Router();

locationsRouter.get("/data/:id", locationsController.show);
locationsRouter.get("/images/:id", locationsController.showImages);
locationsRouter.get("/weather/:id", locationsController.showWeather);
locationsRouter.post("/filter", locationsController.showFiltered);



module.exports = locationsRouter