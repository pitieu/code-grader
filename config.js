import dotenv from "dotenv";
import path from "path";
import midtransClient from "midtrans-client";
import mailchimp from "@mailchimp/mailchimp_marketing";

const __dirname = path.resolve();
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Initialize the Mailchimp API client with your API key
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

const midtrans = new midtransClient.Snap({
  isProduction: false, // Set this to true for production
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export default {
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  midtrans,
  mailchimp,
};
