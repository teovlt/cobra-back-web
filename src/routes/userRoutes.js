import express from "express";
import * as userController from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", userController.registerUser);
userRouter.get("/:id", userController.getUserById);
userRouter.get("/", userController.getAllUsers);

export default userRouter;
