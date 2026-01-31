const axios = require('axios');

class StockService {
  constructor() {
    this.baseURL = 'https://query1.finance.yahoo.com/v8/finance/chart/';
  }

  // Get stock price for Indian stocks
  async getStockPrice(symbol, exchange = 'NS') {
    try {
      // Format: RELIANCE.NS for NSE, RELIANCE.BO for BSE
      const formattedSymbol = `${symbol}.${exchange}`;
      const url = `${this.baseURL}${formattedSymbol}`;
      
      const response = await axios.get(url);
      
      if (response.data && response.data.chart && response.data.chart.result) {
        const result = response.data.chart.result[0];
        const meta = result.meta;
        const quote = result.indicators.quote[0];
        
        return {
          symbol: symbol,
          exchange: exchange,
          price: meta.regularMarketPrice || quote.close[quote.close.length - 1],
          previousClose: meta.previousClose,
          change: meta.regularMarketPrice - meta.previousClose,
          changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
          currency: meta.currency,
          timestamp: new Date(meta.regularMarketTime * 1000).toISOString()
        };
      }
      
      throw new Error('Invalid response from Yahoo Finance');
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error.message);
      throw error;
    }
  }

  // Get multiple stock prices
  async getMultipleStockPrices(holdings) {
    const promises = holdings.map(holding => 
      this.getStockPrice(holding.symbol, holding.exchange)
        .catch(err => ({
          symbol: holding.symbol,
          exchange: holding.exchange,
          error: err.message
        }))
    );
    
    return await Promise.all(promises);
  }

  // Search for stocks (basic implementation)
  async searchStock(query) {
    try {
      const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${query}&quotesCount=10&newsCount=0`;
      const response = await axios.get(url);
      
      if (response.data && response.data.quotes) {
        // Filter for Indian stocks (NSE/BSE)
        return response.data.quotes
          .filter(quote => quote.exchange === 'NSI' || quote.exchange === 'BOM')
          .map(quote => ({
            symbol: quote.symbol.replace('.NS', '').replace('.BO', ''),
            name: quote.longname || quote.shortname,
            exchange: quote.exchange === 'NSI' ? 'NS' : 'BO',
            type: quote.quoteType
          }));
      }
      
      return [];
    } catch (error) {
      console.error('Error searching stocks:', error.message);
      return [];
    }
  }
}

module.exports = new StockService();
