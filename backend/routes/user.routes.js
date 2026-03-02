import express from "express";
import {
  getAllUsers,
  getUserByUsername,
} from "../controllers/user.controller.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getAllUsers);
router.get("/:username", protectRoute, getUserByUsername);

export default router;
