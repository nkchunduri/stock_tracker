# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Device                          │
│                    (Browser / Mobile)                        │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ HTTPS
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                     Frontend (React)                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Components:                                         │   │
│  │  • PortfolioSummary - Dashboard overview            │   │
│  │  • HoldingsTable - Stock list with P&L              │   │
│  │  • AddHoldingForm - Add new stocks                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                      Vite + Tailwind CSS                     │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ REST API
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                   Backend (Node.js/Express)                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  API Routes:                                         │   │
│  │  • /api/holdings - CRUD operations                  │   │
│  │  • /api/portfolio/summary - Analytics               │   │
│  │  • /api/stock/:symbol - Price data                  │   │
│  │  • /api/alerts - Price alerts                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Services:                                           │   │
│  │  • stockService.js - Yahoo Finance integration      │   │
│  │  • database.js - SQLite operations                  │   │
│  │  • (optional) notificationService.js                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Cron Jobs:                                          │   │
│  │  • Price alert checker (every 5 min)                │   │
│  │  • Portfolio sync (configurable)                    │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────┬────────────────────────────┬────────────────┬────┘
           │                            │                │
           │                            │                │
           ▼                            ▼                ▼
┌──────────────────┐      ┌─────────────────────┐  ┌────────────┐
│   SQLite DB      │      │  Yahoo Finance API  │  │  Firebase  │
│                  │      │                     │  │    FCM     │
│  • holdings      │      │  • Stock prices     │  │ (optional) │
│  • price_history │      │  • NSE/BSE data     │  │            │
│  • alerts        │      │  • Real-time quotes │  │  Push      │
│                  │      │                     │  │  Notifs    │
└──────────────────┘      └─────────────────────┘  └────────────┘
```

## Data Flow

### 1. Adding a Stock

```
User Input → Frontend Form → Validation → API POST /holdings
                                              ↓
                                      Insert to Database
                                              ↓
                                      Return Success
                                              ↓
                                      Refresh Holdings
                                              ↓
                                      Fetch Current Prices
                                              ↓
                                      Display Updated Portfolio
```

### 2. Price Update Flow

```
Cron Job (Every 5 min) → Get Active Holdings → For Each Stock:
                                                     ↓
                                            Yahoo Finance API
                                                     ↓
                                            Parse Price Data
                                                     ↓
                                            Update Database
                                                     ↓
                                            Check Alerts
                                                     ↓
                                            Send Notification (if triggered)
```

### 3. Portfolio Display

```
User Opens App → GET /api/holdings → Database Query
                                           ↓
                                    Fetch Current Prices
                                           ↓
                                    Calculate P&L for each
                                           ↓
                                    Aggregate Summary
                                           ↓
                                    Return to Frontend
                                           ↓
                                    Render Dashboard
```

## Component Hierarchy

```
App.jsx
├── Header
│   ├── Title
│   └── Action Buttons (Refresh, Notifications)
│
├── PortfolioSummary
│   ├── Total Invested Card
│   ├── Current Value Card
│   ├── Total Gain/Loss Card
│   └── Returns Percentage Card
│
├── AddHoldingForm
│   ├── Symbol Input
│   ├── Exchange Select
│   ├── Quantity Input
│   ├── Purchase Price Input
│   ├── Purchase Date Input
│   └── Submit Button
│
└── HoldingsTable
    └── For Each Holding:
        ├── Stock Info
        ├── Quantity
        ├── Average Price
        ├── Current Price
        ├── Invested Value
        ├── Current Value
        ├── Gain/Loss
        └── Delete Button
```

## Database Schema

### Holdings Table
```sql
CREATE TABLE holdings (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  symbol            TEXT NOT NULL,           -- Stock symbol (e.g., "RELIANCE")
  exchange          TEXT NOT NULL,           -- "NS" or "BO"
  quantity          INTEGER NOT NULL,        -- Number of shares
  purchase_price    REAL NOT NULL,          -- Price per share
  purchase_date     TEXT NOT NULL,          -- ISO date string
  created_at        TEXT DEFAULT NOW        -- Timestamp
)
```

### Price History Table
```sql
CREATE TABLE price_history (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  symbol      TEXT NOT NULL,
  price       REAL NOT NULL,
  timestamp   TEXT DEFAULT NOW
)
```

### Alerts Table
```sql
CREATE TABLE alerts (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  symbol        TEXT NOT NULL,
  target_price  REAL NOT NULL,
  alert_type    TEXT NOT NULL,              -- "above" or "below"
  is_active     INTEGER DEFAULT 1,
  created_at    TEXT DEFAULT NOW
)
```

## API Response Examples

### GET /api/holdings
```json
[
  {
    "id": 1,
    "symbol": "RELIANCE",
    "exchange": "NS",
    "quantity": 10,
    "purchase_price": 2450.50,
    "purchase_date": "2024-01-15",
    "currentPrice": 2589.75,
    "investedValue": 24505.00,
    "currentValue": 25897.50,
    "totalGain": 1392.50,
    "totalGainPercent": "5.68",
    "priceInfo": {
      "symbol": "RELIANCE",
      "exchange": "NS",
      "price": 2589.75,
      "previousClose": 2575.00,
      "change": 14.75,
      "changePercent": 0.57,
      "currency": "INR",
      "timestamp": "2024-01-31T10:30:00.000Z"
    }
  }
]
```

### GET /api/portfolio/summary
```json
{
  "totalInvested": "125000.00",
  "currentValue": "132450.50",
  "totalGain": "7450.50",
  "totalGainPercent": "5.96",
  "holdingsCount": 5
}
```

### GET /api/stock/RELIANCE?exchange=NS
```json
{
  "symbol": "RELIANCE",
  "exchange": "NS",
  "price": 2589.75,
  "previousClose": 2575.00,
  "change": 14.75,
  "changePercent": 0.57,
  "currency": "INR",
  "timestamp": "2024-01-31T10:30:00.000Z"
}
```

## Technology Choices Explained

### Why React?
- Component-based architecture
- Large ecosystem
- Easy state management
- Great developer experience

### Why Node.js + Express?
- JavaScript full-stack
- Fast development
- Great for I/O operations (API calls)
- Huge npm ecosystem

### Why SQLite?
- Zero configuration
- Perfect for single-user
- Easy to backup
- Can migrate to PostgreSQL later

### Why Yahoo Finance?
- Free tier available
- Supports Indian markets
- Real-time data
- No API key required (unofficial)

### Why Tailwind CSS?
- Rapid styling
- Consistent design
- Small bundle size
- No CSS conflicts

## Security Considerations

### Current Implementation
- CORS enabled for development
- Input validation on forms
- Error handling in API calls
- SQL injection prevention (parameterized queries)

### For Production (TODO)
- [ ] Add JWT authentication
- [ ] Rate limiting on API
- [ ] HTTPS only
- [ ] Environment variable validation
- [ ] Database encryption
- [ ] Session management
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Security headers
- [ ] Input sanitization

## Performance Optimizations

### Current
- Auto-refresh every 5 minutes (not polling)
- Batch API calls for multiple stocks
- Minimal re-renders with React
- Cron jobs instead of continuous polling

### Future Improvements
- Redis caching for stock prices
- Database indexing
- GraphQL for selective data fetching
- WebSocket for real-time updates
- Service worker for offline support
- Image/asset optimization
- Code splitting

## Scalability Path

### Phase 1: Single User (Current)
- SQLite database
- Single server
- Manual deployment

### Phase 2: Multi-User
- PostgreSQL database
- User authentication
- Session management
- Cloud deployment

### Phase 3: Production Scale
- Database replicas
- Load balancing
- Redis caching
- CDN for static assets
- Microservices architecture
- Queue system for notifications
- Advanced monitoring

## Monitoring & Observability

### Recommended Tools
- **Application**: Sentry for error tracking
- **Performance**: New Relic or DataDog
- **Uptime**: UptimeRobot
- **Logs**: LogRocket or Papertrail
- **Database**: pg_stat_statements

### Key Metrics to Track
- API response times
- Database query performance
- Error rates
- User engagement
- Portfolio update frequency
- Notification delivery rate

## Development Workflow

```
1. Local Development
   ├── Backend: npm start (port 3001)
   ├── Frontend: npm run dev (port 3000)
   └── Hot reload enabled

2. Testing
   ├── Manual testing in browser
   ├── API testing with curl/Postman
   └── Database inspection with SQLite browser

3. Deployment
   ├── Build frontend: npm run build
   ├── Deploy backend to Railway/Render
   ├── Deploy frontend to Vercel
   └── Update environment variables

4. Monitoring
   ├── Check logs
   ├── Monitor error rates
   └── Track performance
```

## Future Architecture (Multi-User)

```
Load Balancer
     │
     ├── Frontend Server 1 ─┐
     ├── Frontend Server 2 ─┼─→ CDN
     └── Frontend Server 3 ─┘
     
     ├── API Server 1 ─┐
     ├── API Server 2 ─┼─→ Redis Cache ──→ PostgreSQL (Primary)
     └── API Server 3 ─┘                        │
                                                ├─→ Read Replica 1
                                                └─→ Read Replica 2
     
     ├── Worker 1 (Price Updates) ─┐
     └── Worker 2 (Notifications)  ─┴─→ Message Queue
```

---

This architecture is designed to be:
- **Simple**: Easy to understand and modify
- **Scalable**: Can grow with your needs
- **Maintainable**: Clean separation of concerns
- **Flexible**: Easy to swap components
