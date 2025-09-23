import { Router } from "express";
import { checkAuth } from "../middlewares/isAuthenticated";

export const router = Router();

/**
 * @route GET /api/ping
 * @description Healthcheck to check if the server is running.
 * @access Public
 * @returns {object} Returns a JSON object with a message property indicating the server is running.
 */
router.get("/ping", (req, res) => {
  res.status(200).json({ message: "The server is running!" });
});

router.get("/", checkAuth, (req, res) => {
  res.render("home", {
    isAuthenticated: req.isAuthenticated,
    userInfo: req.session.userInfo,
  });
});
