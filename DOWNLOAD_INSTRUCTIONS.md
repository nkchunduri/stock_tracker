# 📦 Stock Portfolio Tracker - Download Package

## What's Included

This archive contains a **complete, working stock portfolio tracking application** for Indian stocks (NSE/BSE).

### Package Contents:
- ✅ Full source code (Backend + Frontend)
- ✅ All documentation (README, guides, setup instructions)
- ✅ Sample data script
- ✅ Automated setup script
- ✅ Everything you need to run locally

## File Structure

```
stock-portfolio-tracker/
├── backend/                  # Node.js Express API
│   ├── server.js            # Main server file
│   ├── database.js          # SQLite database setup
│   ├── stockService.js      # Yahoo Finance integration
│   ├── package.json         # Backend dependencies
│   └── .env                 # Environment variables
│
├── frontend/                # React application
│   ├── src/
│   │   ├── App.jsx         # Main component
│   │   ├── components/     # React components
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Tailwind styles
│   ├── index.html
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js
│
├── README.md               # Full documentation
├── QUICK_START.md          # 5-minute setup guide
├── NOTIFICATIONS_SETUP.md  # Notification configuration
├── DEPLOYMENT.md           # Production deployment
├── ARCHITECTURE.md         # System architecture
├── setup.sh                # Automated setup script
└── sampleData.js           # Test data

```

## 🚀 How to Extract and Run (macOS)

### Step 1: Extract the Archive

**Option A: Using Finder (easiest)**
1. Double-click `stock-portfolio-tracker.tar.gz`
2. macOS will automatically extract it

**Option B: Using Terminal**
```bash
# Navigate to Downloads folder
cd ~/Downloads

# Extract the archive
tar -xzf stock-portfolio-tracker.tar.gz

# Go into the folder
cd stock-portfolio-tracker
```

### Step 2: Install Node.js (if needed)

Check if you have Node.js:
```bash
node --version
```

If you see a version number (like v18.x.x or v20.x.x), you're good!

If not, download from: https://nodejs.org (get the LTS version)

### Step 3: Run the Setup Script

```bash
# Make it executable
chmod +x setup.sh

# Run it
./setup.sh
```

This will install all dependencies automatically.

### Step 4: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

You should see: `Server running on port 3001`

**Terminal 2 - Frontend:**
Open a new terminal tab (⌘+T) and run:
```bash
cd frontend
npm run dev
```

You should see: `Local: http://localhost:3000`

### Step 5: Open in Browser

Open your browser and go to:
```
http://localhost:3000
```

## 📖 First Steps

1. **Add your first stock:**
   - Enter symbol (e.g., RELIANCE, TCS, INFY)
   - Choose exchange (NSE or BSE)
   - Enter quantity, purchase price, and date
   - Click "Add Stock"

2. **Watch it update:**
   - The app will fetch current prices automatically
   - See your gains/losses in real-time

3. **Explore features:**
   - View portfolio summary
   - Track individual stock performance
   - Set up notifications (optional)

## 📚 Documentation

- **QUICK_START.md** - Get running in 5 minutes
- **README.md** - Full feature documentation
- **NOTIFICATIONS_SETUP.md** - Set up phone alerts
- **DEPLOYMENT.md** - Deploy to production
- **ARCHITECTURE.md** - How it all works

## 🆘 Troubleshooting

**"command not found: node"**
→ Install Node.js from https://nodejs.org

**"Port 3000 already in use"**
→ Close other apps using that port, or edit `frontend/vite.config.js`

**"Cannot connect to backend"**
→ Make sure backend is running on port 3001

**Stock prices not showing**
→ Check internet connection and stock symbol spelling

## 💡 What to Do Next

1. ✅ Run the app locally
2. 📱 Set up notifications (see NOTIFICATIONS_SETUP.md)
3. 🚀 Deploy to production (see DEPLOYMENT.md)
4. 🎨 Customize for your needs

## 🌟 Features

- ✅ Real-time Indian stock prices (NSE/BSE)
- ✅ Portfolio gain/loss tracking
- ✅ Automatic price updates
- ✅ Beautiful dashboard
- ✅ Price alerts (setup required)
- ✅ Phone notifications (optional)
- ✅ Easy to customize

## 🔧 Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** SQLite
- **APIs:** Yahoo Finance

## 📧 Need Help?

Check the documentation files included in this package:
- Most common issues → QUICK_START.md
- API questions → README.md
- Deployment help → DEPLOYMENT.md

---

**Happy tracking! 📈💰**

*Built with ❤️ for Indian stock market investors*
