# 📈 Indian Stock Portfolio Tracker

A modern web application to automatically track your Indian stock portfolio with real-time price updates and notifications.

## Features

✅ **Portfolio Management**
- Add/remove stocks from NSE and BSE
- Track purchase price, quantity, and date
- Automatic calculation of gains/losses

✅ **Real-time Data**
- Fetches current prices from Yahoo Finance API
- Auto-refresh every 5 minutes during market hours
- Support for both NSE and BSE stocks

✅ **Portfolio Analytics**
- Total invested amount
- Current portfolio value
- Overall gains/losses (₹ and %)
- Individual stock performance

✅ **Price Alerts** (Backend Ready)
- Set target prices for stocks
- Get notified when stocks hit your targets
- Works during market hours (9:15 AM - 3:30 PM IST)

✅ **Notifications** (Setup Required)
- Firebase Cloud Messaging for push notifications
- Twilio for SMS alerts (optional)

## Tech Stack

### Backend
- Node.js + Express
- SQLite database
- Yahoo Finance API for stock data
- Cron jobs for automated price checks

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Axios for API calls
- Recharts for visualizations
- Lucide React for icons

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

### Adding Stocks

1. Fill in the "Add New Holding" form:
   - **Stock Symbol**: Enter the stock symbol (e.g., RELIANCE, TCS, INFY)
   - **Exchange**: Choose NSE or BSE
   - **Quantity**: Number of shares
   - **Purchase Price**: Price per share in ₹
   - **Purchase Date**: Date of purchase

2. Click "Add Stock"

### Stock Symbol Examples

**NSE Stocks:**
- RELIANCE (Reliance Industries)
- TCS (Tata Consultancy Services)
- INFY (Infosys)
- HDFCBANK (HDFC Bank)
- ITC (ITC Limited)

**BSE Stocks:**
- Same symbols, just select BSE exchange

### Viewing Portfolio

- **Portfolio Summary**: See total invested, current value, and gains/losses at the top
- **Holdings Table**: View detailed breakdown of each stock
- **Auto-refresh**: Data updates automatically every 5 minutes

### Deleting Holdings

Click the trash icon (🗑️) next to any holding to remove it from your portfolio.

## Setting Up Notifications

### Option 1: Firebase Cloud Messaging (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Add a web app to your project
4. Get your Firebase config and server key
5. Add to `backend/.env`:
```
FIREBASE_SERVER_KEY=your_server_key_here
```

6. Add Firebase SDK to your frontend and register for notifications

### Option 2: Twilio SMS

1. Sign up at [Twilio](https://www.twilio.com)
2. Get your Account SID, Auth Token, and Twilio phone number
3. Add to `backend/.env`:
```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
YOUR_PHONE_NUMBER=your_personal_number
```

## API Endpoints

### Holdings
- `GET /api/holdings` - Get all holdings with current prices
- `POST /api/holdings` - Add new holding
- `PUT /api/holdings/:id` - Update holding
- `DELETE /api/holdings/:id` - Delete holding

### Stock Data
- `GET /api/stock/:symbol?exchange=NS` - Get current stock price
- `GET /api/search?q=query` - Search for stocks

### Portfolio
- `GET /api/portfolio/summary` - Get portfolio summary

### Alerts
- `GET /api/alerts` - Get all active alerts
- `POST /api/alerts` - Create new alert
- `DELETE /api/alerts/:id` - Delete alert

## Database Schema

### Holdings Table
```sql
CREATE TABLE holdings (
  id INTEGER PRIMARY KEY,
  symbol TEXT NOT NULL,
  exchange TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  purchase_price REAL NOT NULL,
  purchase_date TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
```

### Alerts Table
```sql
CREATE TABLE alerts (
  id INTEGER PRIMARY KEY,
  symbol TEXT NOT NULL,
  target_price REAL NOT NULL,
  alert_type TEXT NOT NULL,  -- 'above' or 'below'
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
```

## Market Hours

The app is optimized for Indian market hours:
- **NSE/BSE Trading Hours**: 9:15 AM - 3:30 PM IST (Monday to Friday)
- **Price alerts** are checked every 5 minutes during market hours
- **Auto-refresh** works outside market hours but data may be stale

## Troubleshooting

### Backend won't start
- Check if port 3001 is available
- Ensure all dependencies are installed: `npm install`
- Check for errors in console

### Frontend won't start
- Check if port 3000 is available
- Ensure all dependencies are installed: `npm install`
- Clear node_modules and reinstall if needed

### Stock prices not updating
- Verify internet connection
- Check if Yahoo Finance API is accessible
- Ensure stock symbol is correct (uppercase)
- Try different exchange (NS vs BO)

### Database errors
- Delete `backend/portfolio.db` and restart backend to recreate database
- Check file permissions

## Future Enhancements

- 📊 Advanced charts and analytics
- 📱 Progressive Web App (PWA) for mobile
- 🔔 Browser push notifications
- 📈 Historical performance tracking
- 💰 Dividend tracking
- 🎯 Portfolio rebalancing suggestions
- 📰 News integration for stocks
- 🌐 Multi-user support with authentication

## Security Notes

⚠️ **Important for Production:**
- Add authentication before deploying
- Use environment variables for all sensitive data
- Enable HTTPS
- Add rate limiting to API endpoints
- Validate all user inputs
- Use PostgreSQL instead of SQLite for production

## License

MIT License - feel free to use for personal or commercial projects.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API endpoint documentation
3. Check browser console for errors
4. Verify backend logs

---

**Happy Trading! 📈💰**

*Disclaimer: This is a portfolio tracking tool only. It does not provide investment advice. Always do your own research before making investment decisions.*
