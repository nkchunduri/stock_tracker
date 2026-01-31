# 🚀 Deployment Guide

This guide covers deploying your Stock Portfolio Tracker to production.

## Prerequisites

- Git repository (GitHub, GitLab, etc.)
- Domain name (optional but recommended)
- Basic understanding of deployment platforms

---

## Option 1: Deploy to Vercel (Frontend) + Railway (Backend)

This is the recommended approach for beginners. Both offer generous free tiers.

### Deploy Backend to Railway

1. **Sign up for Railway**
   - Go to [Railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` folder

3. **Configure Environment**
   - In Railway dashboard, go to your service
   - Click "Variables" tab
   - Add environment variables:
     ```
     PORT=3001
     FIREBASE_SERVER_KEY=your_key (if using Firebase)
     ```

4. **Add PostgreSQL Database** (recommended for production)
   - In Railway project, click "New"
   - Select "Database" → "PostgreSQL"
   - Update backend to use PostgreSQL instead of SQLite

5. **Get Backend URL**
   - Railway will provide a URL like: `https://your-app.railway.app`
   - Copy this URL

### Deploy Frontend to Vercel

1. **Sign up for Vercel**
   - Go to [Vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New Project"
   - Import your GitHub repository
   - Set root directory to `frontend`

3. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variables**
   - Add `VITE_API_URL=https://your-app.railway.app`

5. **Update Frontend API Calls**
   - Update `frontend/src/App.jsx`:
   ```javascript
   const API_BASE = import.meta.env.VITE_API_URL || '/api';
   ```

6. **Deploy**
   - Click "Deploy"
   - Vercel will provide a URL like: `https://your-app.vercel.app`

7. **Update CORS in Backend**
   - In `backend/server.js`, update CORS:
   ```javascript
   app.use(cors({
     origin: 'https://your-app.vercel.app',
     credentials: true
   }));
   ```

---

## Option 2: Deploy to Render (Full Stack)

Render can host both frontend and backend on their free tier.

### Deploy Backend

1. **Sign up for Render**
   - Go to [Render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Dashboard → "New" → "Web Service"
   - Connect your repository
   - Configure:
     - Name: portfolio-tracker-backend
     - Root Directory: `backend`
     - Environment: Node
     - Build Command: `npm install`
     - Start Command: `npm start`

3. **Add Environment Variables**
   - In service settings, add variables
   - Add PostgreSQL database from Render

4. **Deploy**
   - Render auto-deploys on git push

### Deploy Frontend

1. **Create Static Site**
   - Dashboard → "New" → "Static Site"
   - Connect repository
   - Configure:
     - Name: portfolio-tracker-frontend
     - Root Directory: `frontend`
     - Build Command: `npm install && npm run build`
     - Publish Directory: `dist`

2. **Add Environment Variables**
   - `VITE_API_URL`: Your backend URL from Render

3. **Deploy**
   - Click "Create Static Site"

---

## Option 3: Deploy to Heroku

### Deploy Backend

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd backend
   heroku create portfolio-tracker-backend
   ```

4. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set FIREBASE_SERVER_KEY=your_key
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

### Deploy Frontend

Similar process, or use Vercel/Netlify for frontend.

---

## Database Migration: SQLite → PostgreSQL

For production, migrate from SQLite to PostgreSQL:

### Install PostgreSQL Driver

```bash
npm install pg
```

### Update Database Connection

Replace `backend/database.js`:

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Create tables
const initDatabase = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS holdings (
      id SERIAL PRIMARY KEY,
      symbol TEXT NOT NULL,
      exchange TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      purchase_price DECIMAL(10,2) NOT NULL,
      purchase_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS price_history (
      id SERIAL PRIMARY KEY,
      symbol TEXT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS alerts (
      id SERIAL PRIMARY KEY,
      symbol TEXT NOT NULL,
      target_price DECIMAL(10,2) NOT NULL,
      alert_type TEXT NOT NULL,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

initDatabase();

module.exports = pool;
```

### Update Queries

Replace SQLite queries with PostgreSQL syntax:

```javascript
// SQLite
db.all('SELECT * FROM holdings', (err, rows) => {...});

// PostgreSQL
const { rows } = await pool.query('SELECT * FROM holdings');
```

---

## Custom Domain Setup

### Vercel

1. Go to project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Railway

1. Go to service settings
2. Click "Settings" → "Domains"
3. Add custom domain
4. Update DNS CNAME record

---

## Environment Variables Checklist

### Backend
```env
# Required
PORT=3001
DATABASE_URL=postgresql://...

# Optional (for notifications)
FIREBASE_SERVER_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
YOUR_PHONE_NUMBER=...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...

# Security (add in production)
NODE_ENV=production
JWT_SECRET=your_secret_key
```

### Frontend
```env
VITE_API_URL=https://your-backend-url.com
```

---

## Security Checklist

Before going to production:

- [ ] Add authentication (JWT, OAuth, etc.)
- [ ] Enable HTTPS (most platforms do this automatically)
- [ ] Set up CORS properly
- [ ] Add rate limiting
- [ ] Validate all inputs
- [ ] Use environment variables for secrets
- [ ] Enable PostgreSQL SSL
- [ ] Add security headers
- [ ] Set up monitoring and logging
- [ ] Create backup strategy for database
- [ ] Add error tracking (Sentry, etc.)

---

## Monitoring & Maintenance

### Application Monitoring

Use services like:
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **New Relic**: Performance monitoring

### Database Backups

```bash
# PostgreSQL backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### Scheduled Backups

Set up cron job or use platform features:
- Railway: Automated backups available
- Render: Database backups in paid tier
- Heroku: `heroku pg:backups:schedule`

---

## Performance Optimization

1. **Enable Caching**
   ```javascript
   // Add caching middleware
   const cache = new Map();
   
   app.use((req, res, next) => {
     const key = req.url;
     const cached = cache.get(key);
     if (cached) {
       return res.json(cached);
     }
     next();
   });
   ```

2. **Compress Responses**
   ```bash
   npm install compression
   ```
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

3. **Frontend Optimization**
   - Enable Vite's build optimization
   - Use lazy loading for components
   - Optimize images
   - Enable CDN for static assets

---

## Troubleshooting Deployment

### Common Issues

**Issue**: Backend not connecting to database
- Check DATABASE_URL is correct
- Verify SSL settings
- Check firewall rules

**Issue**: Frontend can't reach backend
- Verify CORS settings
- Check API_URL environment variable
- Ensure backend is running

**Issue**: Cron jobs not running
- Check server timezone
- Verify cron syntax
- Use platform's scheduler if available

**Issue**: High memory usage
- Implement connection pooling
- Add query limits
- Use caching

---

## Cost Estimates (Monthly)

### Free Tier
- **Vercel** (Frontend): Free for personal projects
- **Railway** (Backend): $5 credit/month (enough for small apps)
- **Render** (Full stack): Free tier available
- **Total**: $0 - $5/month

### Low Traffic
- **Vercel Pro**: $20/month
- **Railway**: $5-10/month
- **PostgreSQL**: Included or $5-10/month
- **Total**: ~$30/month

### Medium Traffic
- **Vercel Pro**: $20/month
- **Railway**: $20-30/month
- **Managed PostgreSQL**: $15/month
- **Total**: ~$55-65/month

---

## Scaling Considerations

When your app grows:

1. **Database**
   - Add read replicas
   - Implement database sharding
   - Use Redis for caching

2. **Backend**
   - Use load balancer
   - Horizontal scaling
   - Background job workers

3. **Frontend**
   - CDN for assets
   - Code splitting
   - Progressive Web App (PWA)

4. **Monitoring**
   - Set up alerts
   - Track key metrics
   - Regular performance audits

---

## Next Steps After Deployment

1. **Add Features**
   - User authentication
   - Multiple portfolios
   - Advanced analytics
   - Social features

2. **Marketing**
   - Create landing page
   - SEO optimization
   - Social media presence
   - Blog/documentation

3. **Monetization** (if desired)
   - Premium features
   - API access
   - Affiliate programs
   - Advertisements

---

## Support Resources

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- PostgreSQL Docs: https://www.postgresql.org/docs

---

**Good luck with your deployment! 🚀**
