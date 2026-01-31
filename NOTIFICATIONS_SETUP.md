# 🔔 Notification Setup Guide

This guide will help you set up phone notifications for your stock portfolio tracker.

## Option 1: Firebase Cloud Messaging (Free & Recommended)

Firebase Cloud Messaging (FCM) is Google's free notification service that works on both Android and iOS.

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name (e.g., "Stock Portfolio Tracker")
4. Disable Google Analytics (optional)
5. Click "Create project"

### Step 2: Add Web App

1. In your Firebase project, click the web icon (</>) to add a web app
2. Register app with nickname (e.g., "Portfolio Tracker Web")
3. Copy the Firebase configuration object

### Step 3: Get Server Key

1. In Firebase Console, go to Project Settings (gear icon)
2. Go to "Cloud Messaging" tab
3. Under "Project credentials", find "Server key"
4. Copy this key

### Step 4: Update Backend

1. Open `backend/.env`
2. Add your Firebase server key:
```
FIREBASE_SERVER_KEY=YOUR_SERVER_KEY_HERE
```

### Step 5: Add Firebase to Frontend

1. Install Firebase SDK:
```bash
cd frontend
npm install firebase
```

2. Create `frontend/src/firebase.js`:
```javascript
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY'
      });
      console.log('FCM Token:', token);
      return token;
    }
  } catch (error) {
    console.error('Notification permission error:', error);
  }
};

export { messaging };
```

3. Get VAPID Key:
   - In Firebase Console → Project Settings → Cloud Messaging
   - Under "Web configuration", generate a new key pair
   - Copy the "Key pair" value

4. Create `frontend/public/firebase-messaging-sw.js`:
```javascript
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background message:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

### Step 6: Update Backend to Send Notifications

Create `backend/notificationService.js`:
```javascript
const axios = require('axios');

class NotificationService {
  constructor() {
    this.serverKey = process.env.FIREBASE_SERVER_KEY;
    this.fcmUrl = 'https://fcm.googleapis.com/fcm/send';
  }

  async sendPriceAlert(token, symbol, currentPrice, targetPrice, alertType) {
    try {
      const message = {
        to: token,
        notification: {
          title: `🔔 Price Alert: ${symbol}`,
          body: `${symbol} is ${alertType} ₹${targetPrice}. Current price: ₹${currentPrice}`,
          icon: '/icon.png',
          click_action: 'https://your-app-url.com'
        }
      };

      await axios.post(this.fcmUrl, message, {
        headers: {
          'Authorization': `key=${this.serverKey}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  async sendDailySummary(token, summary) {
    try {
      const profitLoss = parseFloat(summary.totalGain);
      const emoji = profitLoss >= 0 ? '📈' : '📉';
      
      const message = {
        to: token,
        notification: {
          title: `${emoji} Daily Portfolio Update`,
          body: `Value: ₹${summary.currentValue} | P/L: ₹${summary.totalGain} (${summary.totalGainPercent}%)`,
          icon: '/icon.png'
        }
      };

      await axios.post(this.fcmUrl, message, {
        headers: {
          'Authorization': `key=${this.serverKey}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error sending daily summary:', error);
    }
  }
}

module.exports = new NotificationService();
```

### Step 7: Store FCM Token

Add endpoint in `backend/server.js`:
```javascript
// Store user's FCM token
app.post('/api/notification-token', (req, res) => {
  const { token } = req.body;
  // Store token in database or environment variable
  // For now, just log it
  console.log('FCM Token received:', token);
  res.json({ message: 'Token saved' });
});
```

### Step 8: Test Notifications

1. In your React app, call `requestNotificationPermission()` on page load
2. Allow notifications when prompted
3. Copy the FCM token from console
4. Test sending a notification using Firebase Console or backend service

---

## Option 2: Twilio SMS (Paid but Simple)

Twilio is great for SMS notifications but requires payment after free trial.

### Step 1: Sign Up for Twilio

1. Go to [Twilio](https://www.twilio.com/try-twilio)
2. Sign up for a free account
3. Verify your phone number

### Step 2: Get Credentials

1. From Twilio Console Dashboard, copy:
   - Account SID
   - Auth Token
2. Get a Twilio phone number (free trial includes one)

### Step 3: Update Backend

1. Install Twilio:
```bash
cd backend
npm install twilio
```

2. Update `backend/.env`:
```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
YOUR_PHONE_NUMBER=+91xxxxxxxxxx
```

3. Create `backend/smsService.js`:
```javascript
const twilio = require('twilio');

class SMSService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
    this.toNumber = process.env.YOUR_PHONE_NUMBER;
  }

  async sendPriceAlert(symbol, currentPrice, targetPrice, alertType) {
    try {
      await this.client.messages.create({
        body: `🔔 ${symbol} is ${alertType} ₹${targetPrice}. Current: ₹${currentPrice}`,
        from: this.fromNumber,
        to: this.toNumber
      });
      console.log('SMS sent successfully');
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  }

  async sendDailySummary(summary) {
    const profitLoss = parseFloat(summary.totalGain);
    const emoji = profitLoss >= 0 ? '📈' : '📉';
    
    try {
      await this.client.messages.create({
        body: `${emoji} Portfolio: ₹${summary.currentValue}\nP/L: ₹${summary.totalGain} (${summary.totalGainPercent}%)`,
        from: this.fromNumber,
        to: this.toNumber
      });
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  }
}

module.exports = new SMSService();
```

4. Update cron job in `server.js`:
```javascript
const smsService = require('./smsService');

// In the cron job where alerts are checked:
if (alert.alert_type === 'above' && priceData.price >= alert.target_price) {
  await smsService.sendPriceAlert(
    alert.symbol,
    priceData.price,
    alert.target_price,
    'above'
  );
}
```

---

## Option 3: Telegram Bot (Free & Easy)

Telegram bots are free and very easy to set up.

### Step 1: Create Telegram Bot

1. Open Telegram and search for @BotFather
2. Send `/newbot` command
3. Follow prompts to create bot
4. Copy the bot token

### Step 2: Get Your Chat ID

1. Search for @userinfobot on Telegram
2. Start a chat with it
3. Copy your Chat ID

### Step 3: Update Backend

1. Install node-telegram-bot-api:
```bash
cd backend
npm install node-telegram-bot-api
```

2. Update `backend/.env`:
```
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

3. Create `backend/telegramService.js`:
```javascript
const TelegramBot = require('node-telegram-bot-api');

class TelegramService {
  constructor() {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
    this.chatId = process.env.TELEGRAM_CHAT_ID;
  }

  async sendPriceAlert(symbol, currentPrice, targetPrice, alertType) {
    const message = `🔔 *Price Alert*\n\n${symbol} is ${alertType} ₹${targetPrice}\nCurrent Price: ₹${currentPrice}`;
    
    try {
      await this.bot.sendMessage(this.chatId, message, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Error sending Telegram message:', error);
    }
  }

  async sendDailySummary(summary) {
    const profitLoss = parseFloat(summary.totalGain);
    const emoji = profitLoss >= 0 ? '📈' : '📉';
    
    const message = `${emoji} *Daily Portfolio Update*\n\nCurrent Value: ₹${summary.currentValue}\nTotal Gain/Loss: ₹${summary.totalGain}\nReturns: ${summary.totalGainPercent}%`;
    
    try {
      await this.bot.sendMessage(this.chatId, message, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Error sending Telegram message:', error);
    }
  }
}

module.exports = new TelegramService();
```

---

## Testing Your Notifications

### Test Price Alerts

1. Add a stock to your portfolio
2. Create an alert with a price that will trigger immediately
3. Wait for the cron job to run (every 5 minutes during market hours)
4. Check your phone for notification

### Test Daily Summary

Add this endpoint to `backend/server.js` for testing:
```javascript
app.get('/api/test-notification', async (req, res) => {
  try {
    const summary = await getSummary(); // Your existing summary function
    // Choose your notification service
    await notificationService.sendDailySummary(token, summary); // Firebase
    // OR
    await smsService.sendDailySummary(summary); // Twilio
    // OR
    await telegramService.sendDailySummary(summary); // Telegram
    
    res.json({ message: 'Test notification sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

Visit `http://localhost:3001/api/test-notification` to test.

---

## Troubleshooting

### Firebase Issues
- Make sure server key is correct
- Check if notifications are blocked in browser
- Verify VAPID key is set correctly
- Check service worker is registered

### Twilio Issues
- Verify account is active (not suspended)
- Check phone number format (+91 for India)
- Ensure sufficient balance for paid accounts
- Check Twilio console for error messages

### Telegram Issues
- Verify bot token is correct
- Make sure you've started a chat with your bot first
- Check chat ID is correct (should be a number)

---

## Best Practices

1. **Don't spam**: Limit notifications to important events
2. **Batch updates**: Send daily summaries instead of constant updates
3. **User preferences**: Allow users to configure notification settings
4. **Error handling**: Always handle notification failures gracefully
5. **Rate limiting**: Respect API rate limits for all services

---

## Cost Comparison

| Service | Cost | Pros | Cons |
|---------|------|------|------|
| Firebase FCM | Free | Unlimited, cross-platform | Requires web app setup |
| Twilio SMS | ~$0.0075/SMS | Simple, reliable | Costs add up |
| Telegram | Free | Easy, unlimited | Need Telegram app |

**Recommendation**: Start with Telegram for simplicity, migrate to Firebase for production.
