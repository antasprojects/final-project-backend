const { Router } = require("express");

const locationsController = require("../controllers/locations.js");
const usersRouter = require("./users.js");


const locationsRouter = Router();

locationsRouter.get("/data/:id", locationsController.show);
locationsRouter.get("/images/:id", locationsController.showImages);



module.exports = locationsRouter