const { Router } = require("express");
const authenticator = require('../middleware/authenticator');

const usersControllers = require("../controllers/users.js");

const usersRouter = Router();

usersRouter.post("/register", usersControllers.register);
usersRouter.post("/login", usersControllers.login);
usersRouter.get("/validate-token", usersControllers.tokenValidation);
usersRouter.get("/stats", authenticator, usersControllers.showStats);

// New routes for saving and retrieving locations
usersRouter.post("/save", authenticator, usersControllers.saveLocation);
usersRouter.get("/retrieve", authenticator, usersControllers.getSavedLocations);


module.exports = usersRouter;