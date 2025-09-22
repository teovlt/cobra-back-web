import { Router } from "express";
import userRouter from "./userRoutes.js";

export const router = Router();

//API routes
router.use("/users", userRouter);

/**
 * @route GET /api/ping
 * @description Healthcheck to check if the server is running.
 * @access Public
 * @returns {object} Returns a JSON object with a message property indicating the server is running.
 */
router.get("/ping", (req, res) => {
  res.status(200).json({ message: "The server is running!" });
});

/**
 * @route ALL *
 * @description Handles all other routes and returns a 404 error if the route is not found.
 * @access Public
 * @returns {object} Returns a JSON object with an error property indicating the route was not found.
 */
router.use("/", (req, res) => {
  res.status(404).json({ error: `The requested route ${req.originalUrl} was not found` });
});
