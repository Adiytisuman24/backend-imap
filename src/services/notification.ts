import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

/**
 * ✅ Send Slack Notification
 * @param emailBody - The content of the email to be sent as a notification
 */
export const sendSlackNotification = async (emailBody: string) => {
  if (!SLACK_WEBHOOK_URL) {
    console.error("❌ Slack Webhook URL missing in .env file!");
    return;
  }

  const message = { text: `📩 *New Interested Email Received!* \n\n ${emailBody}` };

  try {
    console.log("🚀 Sending Slack Notification...");
    await axios.post(SLACK_WEBHOOK_URL, message);
    console.log("✅ Slack Notification Sent!");
  } catch (error: any) {
    console.error("❌ Error sending Slack notification:", error.response?.data || error.message);
  }
};

/**
 * ✅ Trigger Webhook
 * @param emailData - The email data to be sent to the webhook
 */
export const triggerWebhook = async (emailData: object) => {
  if (!WEBHOOK_URL) {
    console.error("❌ Webhook URL missing in .env file!");
    return;
  }

  try {
    console.log("🚀 Triggering Webhook...");
    await axios.post(WEBHOOK_URL, emailData);
    console.log("✅ Webhook Triggered Successfully!");
  } catch (error: any) {
    console.error("❌ Error triggering Webhook:", error.response?.data || error.message);
  }
};
