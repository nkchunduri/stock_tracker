import React from 'react';
import { TrendingUp, TrendingDown, Wallet, PieChart } from 'lucide-react';

const PortfolioSummary = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const isProfit = parseFloat(summary.totalGain) >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Invested</p>
            <p className="text-2xl font-bold text-gray-900">₹{parseFloat(summary.totalInvested).toLocaleString('en-IN')}</p>
          </div>
          <Wallet className="text-blue-500" size={32} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Current Value</p>
            <p className="text-2xl font-bold text-gray-900">₹{parseFloat(summary.currentValue).toLocaleString('en-IN')}</p>
          </div>
          <PieChart className="text-purple-500" size={32} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Gain/Loss</p>
            <p className={`text-2xl font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
              ₹{parseFloat(summary.totalGain).toLocaleString('en-IN')}
            </p>
          </div>
          {isProfit ? (
            <TrendingUp className="text-green-500" size={32} />
          ) : (
            <TrendingDown className="text-red-500" size={32} />
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Returns</p>
            <p className={`text-2xl font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
              {summary.totalGainPercent}%
            </p>
          </div>
          {isProfit ? (
            <TrendingUp className="text-green-500" size={32} />
          ) : (
            <TrendingDown className="text-red-500" size={32} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;
