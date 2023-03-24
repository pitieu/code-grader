import express from "express";
import ratingController from "../controllers/ratingController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, ratingController.rateSourceCode);
router.get("/user-scores", authMiddleware, ratingController.getUserScores);

export default router;
