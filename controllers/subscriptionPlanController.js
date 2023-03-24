import SubscriptionPlan from "../models/subscriptionPlan.js";

export const createSubscriptionPlan = async (req, res) => {
  try {
    const { name, price, maxRequests } = req.body;

    const subscriptionPlan = new SubscriptionPlan({ name, price, maxRequests });
    await subscriptionPlan.save();

    res
      .status(201)
      .json({ message: "Subscription plan created", subscriptionPlan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSubscriptionPlans = async (req, res) => {
  try {
    const subscriptionPlans = await SubscriptionPlan.find();

    res.json({ subscriptionPlans });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSubscriptionPlan = async (req, res) => {
  try {
    const subscriptionPlan = await SubscriptionPlan.findById(req.params.id);

    if (!subscriptionPlan) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }

    res.json({ subscriptionPlan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateSubscriptionPlan = async (req, res) => {
  try {
    const subscriptionPlan = await SubscriptionPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!subscriptionPlan) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }

    res.json({ message: "Subscription plan updated", subscriptionPlan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteSubscriptionPlan = async (req, res) => {
  try {
    const subscriptionPlan = await SubscriptionPlan.findByIdAndDelete(
      req.params.id
    );

    if (!subscriptionPlan) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }

    res.json({ message: "Subscription plan deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleSubscriptionPlan = async (req, res) => {
  try {
    const subscriptionPlan = await SubscriptionPlan.findById(req.params.id);

    if (!subscriptionPlan) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }

    subscriptionPlan.enabled = !subscriptionPlan.enabled;
    await subscriptionPlan.save();

    res.json({ message: "Subscription plan toggled", subscriptionPlan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default {
  createSubscriptionPlan,
  getSubscriptionPlans,
  getSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  toggleSubscriptionPlan,
};
