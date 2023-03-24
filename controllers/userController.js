import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Joi from "joi";

import config from "../config.js";

import Subscription from "../models/subscription.js";
import SubscriptionPlan from "../models/subscriptionPlan.js";
import Payment from "../models/payment.js";
import ApiKey from "../models/apiKey.js";
import User from "../models/user.js";

const paymentMethodMap = {
  credit_card: {
    name: "Credit Card",
    channels: ["credit_card"],
  },
  bank_transfer_bca: {
    name: "Bank Transfer BCA",
    channels: ["bank_transfer"],
    bank: "bca",
  },
  bank_transfer_mandiri: {
    name: "Bank Transfer Mandiri",
    channels: ["bank_transfer"],
    bank: "mandiri",
  },
  bank_transfer_bni: {
    name: "Bank Transfer BNI",
    channels: ["bank_transfer"],
    bank: "bni",
  },
  gopay: {
    name: "GoPay",
    channels: ["gopay"],
  },
  shopeepay: {
    name: "ShopeePay",
    channels: ["shopeepay"],
  },
  indomaret: {
    name: "Indomaret",
    channels: ["cstore"],
    payment_code: {
      type: "barcode",
      store: "Indomaret",
    },
  },
  alfamart: {
    name: "Alfamart",
    channels: ["cstore"],
    payment_code: {
      type: "barcode",
      store: "Alfamart",
    },
  },
};

export const forgotPassword = async (req, res) => {
  // Validate the request body
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a random password reset token
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // TODO: change to accommodate multi language later on
    // Send a password reset email to the user
    const response = await mailchimp.messages.send({
      message: {
        subject: "Password Reset Request",
        text: `Dear ${user.name},\n\nWe received a request to reset your password. To reset your password, please click on the link below:\n\n${process.env.CLIENT_URL}/reset-password/${resetToken}`,
        to: [{ email: user.email, name: user.name }],
      },
    });

    // Return a success message
    res.status(200).json({
      message: "Password reset email sent. Please check your email.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const register = async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // create the user
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await user.save();

    // find free subscription plan
    const subscriptionPlan = await SubscriptionPlan.findOne({
      name: "Free",
    });

    // create subscription for user
    const subscription = new Subscription({
      user: user._id,
      plan: subscriptionPlan._id,
      status: "active",
      maxRequestsPerDay: subscriptionPlan.maxRequestsPerDay,
      maxRequestsPerMonth: subscriptionPlan.maxRequestsPerMonth,
      startDate: new Date(),
      endDate: new Date(Date.now() + 100 * 365 * 30 * 24 * 60 * 60 * 1000), // free plan will expire in 100 years
    });
    await subscription.save();

    // login user right after registration
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res
      .status(201)
      .json({ message: "User registered successfully", accessToken: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // verify user subscription
    const subscription = await Subscription.findOne({ user: user._id });
    if (!subscription) {
      return res.status(403).json({ message: "Subscription not found" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      accessToken: token,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getApiKeys = async (req, res) => {
  try {
    const apiKeys = await ApiKey.find({ user: req.user._id }, { key: 1 });
    res.status(200).json({ apiKeys });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createApiKey = async (req, res) => {
  try {
    const key = crypto.randomBytes(32).toString("hex");
    const apiKey = new ApiKey({ key, user: req.user._id });

    await apiKey.save();

    res.status(201).json({ message: "API key created", apiKey: apiKey.key });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteApiKey = async (req, res) => {
  try {
    const apiKey = await ApiKey.findOne({
      _id: req.params.id,
      user: req.userId,
    });
    if (!apiKey) {
      return res.status(404).json({ message: "API key not found" });
    }

    await apiKey.remove();

    res.status(200).json({ message: "API key deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const subscribe = async (req, res) => {
  try {
    const { subscriptionPlanId, paymentMethod } = req.body;

    // Check if the subscription plan exists
    const subscriptionPlan = await SubscriptionPlan.findById(
      subscriptionPlanId
    );
    if (!subscriptionPlan) {
      return res.status(400).json({ error: "Invalid subscription plan ID" });
    }

    // Get the current user
    const user = req.user;

    // Build the transaction request based on the payment method
    const paymentMethodConfig = paymentMethodMap[paymentMethod];
    if (!paymentMethodConfig) {
      return res.status(400).json({ error: "Invalid payment method" });
    }

    // Create a payment object to store the transaction details
    const payment = new Payment({
      user: user._id,
      subscriptionPlan: subscriptionPlan._id,
      paymentMethod,
      status: "pending",
      amount: subscriptionPlan.price,
      timestamp: Date.now(),
    });

    // Save the payment object to the database
    await payment.save();

    // Create a transaction request
    const transactionRequest = {
      transaction_details: {
        order_id: payment._id, // Use the payment ID as the order ID
        gross_amount: subscriptionPlan.price,
      },
      ...paymentMethodConfig,
    };
    try {
      // Charge the user's account using Midtrans
      const chargeResponse = await config.midtransClient.charge(
        transactionRequest
      );

      // Update the payment object with the transaction details
      payment.transactionId = chargeResponse.transaction_id;
      payment.status = "processing";
      await payment.save();

      // Return the charge response to the client
      res.json(chargeResponse);
    } catch (error) {
      payment.status = "failed";
      await payment.save();
      throw new Error("Failed to charge user");
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
};

export default {
  register,
  login,
  forgotPassword,
  getApiKeys,
  createApiKey,
  deleteApiKey,
  subscribe,
};
