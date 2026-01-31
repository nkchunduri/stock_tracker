// Sample data to test the application
// Run this after starting the backend: node sampleData.js

const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

const sampleHoldings = [
  {
    symbol: 'RELIANCE',
    exchange: 'NS',
    quantity: 10,
    purchase_price: 2450.50,
    purchase_date: '2024-01-15'
  },
  {
    symbol: 'TCS',
    exchange: 'NS',
    quantity: 5,
    purchase_price: 3650.00,
    purchase_date: '2024-02-10'
  },
  {
    symbol: 'INFY',
    exchange: 'NS',
    quantity: 15,
    purchase_price: 1420.75,
    purchase_date: '2024-03-05'
  },
  {
    symbol: 'HDFCBANK',
    exchange: 'NS',
    quantity: 8,
    purchase_price: 1580.00,
    purchase_date: '2024-01-20'
  },
  {
    symbol: 'ITC',
    exchange: 'NS',
    quantity: 25,
    purchase_price: 425.50,
    purchase_date: '2024-02-28'
  }
];

const sampleAlerts = [
  {
    symbol: 'RELIANCE',
    target_price: 2600.00,
    alert_type: 'above'
  },
  {
    symbol: 'TCS',
    target_price: 3500.00,
    alert_type: 'below'
  }
];

async function addSampleData() {
  try {
    console.log('Adding sample holdings...');
    
    for (const holding of sampleHoldings) {
      const response = await axios.post(`${API_BASE}/holdings`, holding);
      console.log(`✅ Added ${holding.symbol}: ${response.data.message}`);
    }

    console.log('\nAdding sample alerts...');
    
    for (const alert of sampleAlerts) {
      const response = await axios.post(`${API_BASE}/alerts`, alert);
      console.log(`✅ Added alert for ${alert.symbol}: ${response.data.message}`);
    }

    console.log('\n🎉 Sample data added successfully!');
    console.log('\nYour portfolio now contains:');
    console.log('- 10 shares of RELIANCE');
    console.log('- 5 shares of TCS');
    console.log('- 15 shares of INFY');
    console.log('- 8 shares of HDFCBANK');
    console.log('- 25 shares of ITC');
    console.log('\nVisit http://localhost:3000 to see your portfolio!');

  } catch (error) {
    console.error('❌ Error adding sample data:', error.message);
    console.error('\nMake sure the backend is running on port 3001');
    console.error('Start it with: cd backend && npm start');
  }
}

addSampleData();
