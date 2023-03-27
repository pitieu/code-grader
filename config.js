import dotenv from 'dotenv'
import midtransClient from 'midtrans-client'
import mailchimpClient from '@mailchimp/mailchimp_marketing'
import { Configuration, OpenAIApi } from 'openai'
dotenv.config()

// Initialize the Mailchimp API client with your API key
export const mailchimp = mailchimpClient.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
})
// midtrans
export const midtrans = new midtransClient.Snap({
  isProduction: false, // Set this to true for production
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
})
// openai
const configuration = new Configuration({
  apiKey: process.env.CHATGPT_KEY,
})
export const openai = new OpenAIApi(configuration)

export default {
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  midtrans,
  mailchimp,
  openai,
}
