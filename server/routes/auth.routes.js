const express = require("express");
const authController = require("../controller/auth.controller");
const validator = require("../middleware/Validator");

const authRouter = express.Router();

authRouter.post("/register", validator, authController.register);

authRouter.post("/login", authController.login);

authRouter.get("/refreshtoken", authController.refreshToken);

authRouter.post("/logout", authController.logout);

module.exports = authRouter;
