import { WebClient } from '@slack/web-api';
import axios from 'axios';
import { ProcessedEmail } from './imap-service';
import { EmailAccount } from './imap-service';

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

export async function sendSlackNotification(email: ProcessedEmail, account: EmailAccount) {
  try {
    if (!process.env.SLACK_BOT_TOKEN || !process.env.SLACK_CHANNEL) {
      console.log('⚠️ Slack configuration missing, skipping notification');
      return;
    }

    const message = {
      channel: process.env.SLACK_CHANNEL,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🎯 New Interested Email Alert!'
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*From:* ${email.from_email}`
            },
            {
              type: 'mrkdwn',
              text: `*Account:* ${account.email}`
            },
            {
              type: 'mrkdwn',
              text: `*Subject:* ${email.subject}`
            },
            {
              type: 'mrkdwn',
              text: `*Date:* ${new Date(email.date).toLocaleString()}`
            }
          ]
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Preview:*\n${email.body.substring(0, 300)}${email.body.length > 300 ? '...' : ''}`
          }
        },
        {
          type: 'divider'
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '🚀 *Quick Actions:*'
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View in OneBox'
            },
            url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?email=${email.id}`,
            action_id: 'view_email'
          }
        }
      ]
    };

    await slack.chat.postMessage(message);
    console.log('✅ Slack notification sent successfully');
  } catch (error) {
    console.error('❌ Failed to send Slack notification:', error);
  }
}

export async function triggerWebhook(email: ProcessedEmail, account: EmailAccount) {
  try {
    const webhookUrl = process.env.WEBHOOK_URL || 'https://webhook.site/unique-id';
    
    const payload = {
      event: 'email_interested',
      timestamp: new Date().toISOString(),
      email: {
        id: email.id,
        messageId: email.message_id,
        from: email.from_email,
        to: email.to_emails,
        subject: email.subject,
        body: email.body.substring(0, 500),
        category: email.category,
        date: email.date,
        account: {
          id: account.id,
          email: account.email
        }
      },
      metadata: {
        source: 'onebox-email-aggregator',
        version: '1.0.0'
      }
    };

    const response = await axios.post(webhookUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'OneBox-Email-Aggregator/1.0'
      },
      timeout: 10000
    });

    console.log('✅ Webhook triggered successfully:', response.status);
  } catch (error) {
    console.error('❌ Failed to trigger webhook:', error);
  }
}

export async function sendSlackAlert(message: string, type: 'info' | 'warning' | 'error' = 'info') {
  try {
    if (!process.env.SLACK_BOT_TOKEN || !process.env.SLACK_CHANNEL) {
      return;
    }

    const emoji = type === 'error' ? '🚨' : type === 'warning' ? '⚠️' : 'ℹ️';
    
    await slack.chat.postMessage({
      channel: process.env.SLACK_CHANNEL,
      text: `${emoji} ${message}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${emoji} *${type.toUpperCase()}*\n${message}`
          }
        }
      ]
    });
  } catch (error) {
    console.error('Failed to send Slack alert:', error);
  }
}