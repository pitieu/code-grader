import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import SubscriptionPlanData from "./data/subscriptionPlan.js";
import SubscriptionPlan from "./models/subscriptionPlan.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/users", userRoutes);
// app.use("/api/v1/ratings", ratingRoutes);
// app.use("/api/v1/subscriptions", subscriptionRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // add SubscriptionPlanData if SubscriptionPlan is empty
    SubscriptionPlan.find().then((plans) => {
      if (plans.length === 0) {
        SubscriptionPlanData.forEach((plan) => {
          const newPlan = new SubscriptionPlan(plan);
          newPlan.save();

          console.log(`Added ${plan.name} to SubscriptionPlan`);
        });
      }
    });

    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () =>
      console.log(`Server listening on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.log(err));
