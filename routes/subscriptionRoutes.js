import express from "express";

import subscriptionController from "../controllers/subscriptionController.js";
import userController from "../controllers/userController.js";
import subscriptionPlanController from "../controllers/subscriptionPlanController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, subscriptionController.getSubscriptions);
router.post(
  "/upgrade",
  authMiddleware,
  subscriptionController.upgradeSubscription
);

// router.post(
//   "/midtrans-notification",
//   userController.handleMidtransNotification
// );

// admin subscription plan routes
router.post(
  "/admin/subscription-plans",
  authMiddleware,
  adminMiddleware,
  subscriptionPlanController.createSubscriptionPlan
);
router.get(
  "/admin/subscription-plans",
  authMiddleware,
  adminMiddleware,
  subscriptionPlanController.getSubscriptionPlans
);
router.get(
  "/admin/subscription-plans/:id",
  authMiddleware,
  adminMiddleware,
  subscriptionPlanController.getSubscriptionPlan
);
router.put(
  "/admin/subscription-plans/:id",
  authMiddleware,
  adminMiddleware,
  subscriptionPlanController.updateSubscriptionPlan
);
router.delete(
  "/admin/subscription-plans/:id",
  authMiddleware,
  adminMiddleware,
  subscriptionPlanController.deleteSubscriptionPlan
);
router.patch(
  "/admin/subscription-plans/:id/toggle",
  authMiddleware,
  adminMiddleware,
  subscriptionPlanController.toggleSubscriptionPlan
);

export default router;
