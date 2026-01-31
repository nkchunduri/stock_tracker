import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, Bell } from 'lucide-react';
import PortfolioSummary from './components/PortfolioSummary';
import HoldingsTable from './components/HoldingsTable';
import AddHoldingForm from './components/AddHoldingForm';

function App() {
  const [holdings, setHoldings] = useState([]);
  const [summary, setSummary] = useState({
    totalInvested: 0,
    currentValue: 0,
    totalGain: 0,
    totalGainPercent: 0,
    holdingsCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_BASE = '/api';

  useEffect(() => {
    fetchData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [holdingsRes, summaryRes] = await Promise.all([
        axios.get(`${API_BASE}/holdings`),
        axios.get(`${API_BASE}/portfolio/summary`)
      ]);
      setHoldings(holdingsRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch portfolio data. Make sure the backend is running.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAddHolding = async (formData) => {
    try {
      await axios.post(`${API_BASE}/holdings`, formData);
      fetchData();
    } catch (error) {
      console.error('Error adding holding:', error);
      alert('Failed to add holding. Please try again.');
    }
  };

  const handleDeleteHolding = async (id) => {
    if (!confirm('Are you sure you want to delete this holding?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE}/holdings/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting holding:', error);
      alert('Failed to delete holding. Please try again.');
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📈 Stock Portfolio Tracker
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Indian Stock Market - NSE & BSE
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} size={18} />
                Refresh
              </button>
              <button
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                title="Notifications (Coming Soon)"
              >
                <Bell size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Summary */}
        <PortfolioSummary summary={summary} loading={loading} />

        {/* Add Holding Form */}
        <AddHoldingForm onAdd={handleAddHolding} />

        {/* Holdings Table */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Holdings</h2>
          <HoldingsTable
            holdings={holdings}
            loading={loading}
            onDelete={handleDeleteHolding}
          />
        </div>

        {/* Footer Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Tips:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Data refreshes automatically every 5 minutes during market hours</li>
            <li>• Use NSE for most stocks, BSE for stocks not listed on NSE</li>
            <li>• Stock symbols should be exact (e.g., RELIANCE, TCS, INFY)</li>
            <li>• Set up price alerts in the backend to get notifications on your phone</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
