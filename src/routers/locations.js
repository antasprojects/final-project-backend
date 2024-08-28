const { Router } = require("express");

const locationsController = require("../controllers/locations.js");
const usersRouter = require("./users.js");


const locationsRouter = Router();

locationsRouter.get("/data/:id", locationsController.show);


module.exports = locationsRouter