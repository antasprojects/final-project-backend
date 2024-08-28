const { Router } = require("express");

const usersControllers = require("../controllers/users.js");

const usersRouter = Router();

usersRouter.post("/register", usersControllers.register);
usersRouter.post("/login", usersControllers.login);
usersRouter.get("/validate-token", usersControllers.tokenValidation);
usersRouter.get("/stats", usersControllers.showStats);


module.exports = usersRouter;