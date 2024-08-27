const { Router } = require("express");


const usersControllers = require("./controllers/users");

const usersRouter = Router();

usersRouter.post("/signup", usersControllers.signup);
usersRouter.post("/login", usersControllers.login);
usersRouter.get("/validate-token", usersControllers.tokenValidation);
usersRouter.get("/stats", usersControllers.showStats);


module.exports = usersRouter;