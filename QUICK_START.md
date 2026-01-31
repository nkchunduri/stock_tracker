# 📋 Quick Reference Guide

## Getting Started (5 Minutes)

### 1. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### 2. Start Application
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend
npm run dev
```

### 3. Open Application
Visit: http://localhost:3000

---

## Common Stock Symbols (NSE)

| Symbol | Company |
|--------|---------|
| RELIANCE | Reliance Industries |
| TCS | Tata Consultancy Services |
| INFY | Infosys |
| HDFCBANK | HDFC Bank |
| ITC | ITC Limited |
| HINDUNILVR | Hindustan Unilever |
| BHARTIARTL | Bharti Airtel |
| SBIN | State Bank of India |
| BAJFINANCE | Bajaj Finance |
| KOTAKBANK | Kotak Mahindra Bank |
| ASIANPAINT | Asian Paints |
| MARUTI | Maruti Suzuki |
| LT | Larsen & Toubro |
| TITAN | Titan Company |
| WIPRO | Wipro |

---

## Quick Commands

### Add Sample Data
```bash
node sampleData.js
```

### Reset Database
```bash
rm backend/portfolio.db
# Restart backend
```

### View Backend Logs
```bash
cd backend
npm start
```

### Build for Production
```bash
# Frontend
cd frontend
npm run build

# Preview production build
npm run preview
```

---

## API Quick Reference

### Base URL
```
http://localhost:3001/api
```

### Endpoints

**Holdings**
- `GET /holdings` - Get all holdings
- `POST /holdings` - Add holding
- `DELETE /holdings/:id` - Delete holding

**Portfolio**
- `GET /portfolio/summary` - Get summary

**Stock Data**
- `GET /stock/:symbol?exchange=NS` - Get price

**Alerts**
- `GET /alerts` - Get all alerts
- `POST /alerts` - Add alert
- `DELETE /alerts/:id` - Delete alert

---

## Example API Calls

### Add Holding
```bash
curl -X POST http://localhost:3001/api/holdings \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "RELIANCE",
    "exchange": "NS",
    "quantity": 10,
    "purchase_price": 2450.50,
    "purchase_date": "2024-01-15"
  }'
```

### Get Stock Price
```bash
curl http://localhost:3001/api/stock/RELIANCE?exchange=NS
```

### Create Alert
```bash
curl -X POST http://localhost:3001/api/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "RELIANCE",
    "target_price": 2600,
    "alert_type": "above"
  }'
```

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or use different port
PORT=3002 npm start
```

### Database Locked
```bash
# Close all connections and restart
rm backend/portfolio.db
cd backend && npm start
```

### Stock Not Found
- Check symbol is correct (uppercase)
- Try different exchange (NS vs BO)
- Verify stock is actively traded

### API Not Responding
- Check backend is running
- Verify port 3001 is accessible
- Check firewall settings
- Look for errors in backend console

---

## File Structure

```
stock-portfolio-tracker/
├── backend/
│   ├── server.js          # Main server
│   ├── database.js        # Database setup
│   ├── stockService.js    # Yahoo Finance integration
│   ├── package.json       # Dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main component
│   │   ├── components/   # React components
│   │   ├── main.jsx      # Entry point
│   │   └── index.css     # Styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── README.md
├── NOTIFICATIONS_SETUP.md
├── DEPLOYMENT.md
└── sampleData.js
```

---

## Environment Variables

### Backend (.env)
```env
PORT=3001
FIREBASE_SERVER_KEY=optional
TWILIO_ACCOUNT_SID=optional
TWILIO_AUTH_TOKEN=optional
TELEGRAM_BOT_TOKEN=optional
```

### Frontend
```env
VITE_API_URL=http://localhost:3001
```

---

## Market Hours (IST)

| Exchange | Trading Hours |
|----------|---------------|
| NSE | 9:15 AM - 3:30 PM |
| BSE | 9:15 AM - 3:30 PM |

**Note**: Price updates are most accurate during market hours.

---

## Notification Options

| Method | Cost | Setup Time | Reliability |
|--------|------|------------|-------------|
| Telegram | Free | 5 min | ⭐⭐⭐⭐⭐ |
| Firebase | Free | 30 min | ⭐⭐⭐⭐ |
| Twilio SMS | Paid | 10 min | ⭐⭐⭐⭐⭐ |

**Recommendation**: Start with Telegram

---

## Performance Tips

1. **Reduce API Calls**: Cache prices for 5 minutes
2. **Limit Holdings**: Keep under 50 for best performance
3. **Use NSE**: Generally faster than BSE
4. **Background Updates**: Use cron jobs, not polling
5. **Database Indexes**: Add if many holdings

---

## Next Steps

1. ✅ Set up basic portfolio
2. ✅ Add your stocks
3. 📱 Configure notifications (optional)
4. 📊 Explore adding charts
5. 🚀 Deploy to production
6. 🔐 Add authentication
7. 📈 Add advanced features

---

## Resources

- **Yahoo Finance**: https://finance.yahoo.com
- **NSE India**: https://www.nseindia.com
- **BSE India**: https://www.bseindia.com
- **API Docs**: See README.md

---

## Support

For issues:
1. Check this guide
2. Review README.md
3. Check console logs
4. Test API endpoints
5. Verify stock symbols

---

**Happy Tracking! 📈**
