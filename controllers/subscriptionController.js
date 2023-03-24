import Subscription from "../models/subscription.js";
import User from "../models/user.js";

export const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const upgradeSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const subscriptionId = req.body.subscriptionId;
    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    user.subscription = subscription.name;
    user.requestLimit = subscription.requestLimit;
    await user.save();

    res.status(200).json({
      message: "Subscription upgraded successfully",
      subscription: user.subscription,
      requestLimit: user.requestLimit,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createCheckoutSession = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!plan) {
      return res.status(400).json({ message: "Plan is required" });
    }

    // Replace the following IDs with your actual product price IDs
    const priceIdMap = {
      free: "price_xxx",
      developer: "price_yyy",
      team: "price_zzz",
    };

    const priceId = priceIdMap[plan.toLowerCase()];

    if (!priceId) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url:
        "https://your-website.com/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://your-website.com/cancel",
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const subscribe = async (req, res) => {
  try {
    // Find the subscription plan
    const subscriptionPlan = await Subscription.findById(
      req.params.subscriptionPlanId
    );

    // Create a new payment record
    const payment = new Payment({
      userId: req.user._id,
      subscriptionPlanId: subscriptionPlan._id,
      amount: subscriptionPlan.price,
      paymentStatus: "pending",
    });
    await payment.save();

    // Update the user subscription
    req.user.subscription = subscriptionPlan._id;
    await req.user.save();

    res.json({
      message: "Subscribed successfully.",
      subscription: subscriptionPlan,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "payments",
      populate: {
        path: "subscriptionPlan",
        model: "SubscriptionPlan",
      },
    });

    res.status(200).json(user.payments);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching payment history." });
  }
};

export const createPayment = async (req, res) => {
  try {
    const { subscriptionPlanId, amount, paymentDate } = req.body;

    const user = await User.findById(req.user._id);
    const subscriptionPlan = await SubscriptionPlan.findById(
      subscriptionPlanId
    );

    if (!subscriptionPlan) {
      return res.status(400).json({ error: "Invalid subscription plan ID." });
    }

    // Create a new Payment document and add it to the User's payments array
    const payment = new Payment({
      user: req.user._id,
      subscriptionPlan: subscriptionPlanId,
      amount: amount,
      paymentDate: paymentDate,
    });

    user.payments.push(payment._id);
    await payment.save();
    await user.save();

    res.status(201).json(payment);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the payment." });
  }
};

export default {
  getSubscriptions,
  upgradeSubscription,
  createCheckoutSession,
  subscribe,
  getPaymentHistory,
  createPayment,
};
