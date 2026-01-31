const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const db = require('./database');
const stockService = require('./stockService');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ===== HOLDINGS ENDPOINTS =====

// Get all holdings with current prices
app.get('/api/holdings', async (req, res) => {
  try {
    db.all('SELECT * FROM holdings', async (err, holdings) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (holdings.length === 0) {
        return res.json([]);
      }

      // Fetch current prices
      const pricesData = await stockService.getMultipleStockPrices(holdings);
      
      const enrichedHoldings = holdings.map(holding => {
        const priceInfo = pricesData.find(p => p.symbol === holding.symbol);
        const currentPrice = priceInfo && !priceInfo.error ? priceInfo.price : 0;
        const investedValue = holding.quantity * holding.purchase_price;
        const currentValue = holding.quantity * currentPrice;
        const totalGain = currentValue - investedValue;
        const totalGainPercent = (totalGain / investedValue) * 100;

        return {
          ...holding,
          currentPrice,
          investedValue,
          currentValue,
          totalGain,
          totalGainPercent: totalGainPercent.toFixed(2),
          priceInfo: priceInfo || null
        };
      });

      res.json(enrichedHoldings);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new holding
app.post('/api/holdings', (req, res) => {
  const { symbol, exchange, quantity, purchase_price, purchase_date } = req.body;

  if (!symbol || !exchange || !quantity || !purchase_price || !purchase_date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = `INSERT INTO holdings (symbol, exchange, quantity, purchase_price, purchase_date) 
               VALUES (?, ?, ?, ?, ?)`;

  db.run(sql, [symbol.toUpperCase(), exchange, quantity, purchase_price, purchase_date], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, message: 'Holding added successfully' });
  });
});

// Update holding
app.put('/api/holdings/:id', (req, res) => {
  const { id } = req.params;
  const { quantity, purchase_price, purchase_date } = req.body;

  const sql = `UPDATE holdings SET quantity = ?, purchase_price = ?, purchase_date = ? WHERE id = ?`;

  db.run(sql, [quantity, purchase_price, purchase_date, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Holding updated successfully' });
  });
});

// Delete holding
app.delete('/api/holdings/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM holdings WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Holding deleted successfully' });
  });
});

// ===== STOCK DATA ENDPOINTS =====

// Get current stock price
app.get('/api/stock/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { exchange = 'NS' } = req.query;
    
    const priceData = await stockService.getStockPrice(symbol, exchange);
    res.json(priceData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search stocks
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter required' });
    }
    
    const results = await stockService.searchStock(q);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== PORTFOLIO SUMMARY =====

app.get('/api/portfolio/summary', async (req, res) => {
  try {
    db.all('SELECT * FROM holdings', async (err, holdings) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (holdings.length === 0) {
        return res.json({
          totalInvested: 0,
          currentValue: 0,
          totalGain: 0,
          totalGainPercent: 0,
          holdingsCount: 0
        });
      }

      const pricesData = await stockService.getMultipleStockPrices(holdings);
      
      let totalInvested = 0;
      let currentValue = 0;

      holdings.forEach(holding => {
        const priceInfo = pricesData.find(p => p.symbol === holding.symbol);
        const currentPrice = priceInfo && !priceInfo.error ? priceInfo.price : 0;
        
        totalInvested += holding.quantity * holding.purchase_price;
        currentValue += holding.quantity * currentPrice;
      });

      const totalGain = currentValue - totalInvested;
      const totalGainPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

      res.json({
        totalInvested: totalInvested.toFixed(2),
        currentValue: currentValue.toFixed(2),
        totalGain: totalGain.toFixed(2),
        totalGainPercent: totalGainPercent.toFixed(2),
        holdingsCount: holdings.length
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== ALERTS ENDPOINTS =====

// Get all alerts
app.get('/api/alerts', (req, res) => {
  db.all('SELECT * FROM alerts WHERE is_active = 1', (err, alerts) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(alerts);
  });
});

// Add alert
app.post('/api/alerts', (req, res) => {
  const { symbol, target_price, alert_type } = req.body;

  const sql = `INSERT INTO alerts (symbol, target_price, alert_type) VALUES (?, ?, ?)`;

  db.run(sql, [symbol.toUpperCase(), target_price, alert_type], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, message: 'Alert added successfully' });
  });
});

// Delete alert
app.delete('/api/alerts/:id', (req, res) => {
  const { id } = req.params;

  db.run('UPDATE alerts SET is_active = 0 WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Alert deleted successfully' });
  });
});

// ===== CRON JOBS =====

// Check price alerts every 5 minutes during market hours (9:15 AM - 3:30 PM IST)
cron.schedule('*/5 * * * *', async () => {
  const now = new Date();
  const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const hour = istTime.getHours();
  const minute = istTime.getMinutes();

  // Check if within market hours
  if ((hour === 9 && minute >= 15) || (hour > 9 && hour < 15) || (hour === 15 && minute <= 30)) {
    console.log('Checking price alerts...');
    
    db.all('SELECT * FROM alerts WHERE is_active = 1', async (err, alerts) => {
      if (err || !alerts.length) return;

      for (const alert of alerts) {
        try {
          const priceData = await stockService.getStockPrice(alert.symbol, 'NS');
          
          if (alert.alert_type === 'above' && priceData.price >= alert.target_price) {
            console.log(`ALERT: ${alert.symbol} is above ${alert.target_price}. Current: ${priceData.price}`);
            // TODO: Send notification to phone
          } else if (alert.alert_type === 'below' && priceData.price <= alert.target_price) {
            console.log(`ALERT: ${alert.symbol} is below ${alert.target_price}. Current: ${priceData.price}`);
            // TODO: Send notification to phone
          }
        } catch (error) {
          console.error(`Error checking alert for ${alert.symbol}:`, error.message);
        }
      }
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
