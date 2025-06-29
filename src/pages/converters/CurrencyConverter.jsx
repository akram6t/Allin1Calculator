import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, RotateCcw, RefreshCw, Info } from 'lucide-react';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [conversionRate, setConversionRate] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [conversionHistory, setConversionHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Common currencies with their symbols and names
  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  ];

  // Static exchange rates (as of a recent date)
  // In a real application, these would come from an API
  const exchangeRates = {
    USD: { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.82, CAD: 1.35, AUD: 1.52, CHF: 0.88, CNY: 7.19, INR: 83.15, MXN: 16.75 },
    EUR: { USD: 1.09, EUR: 1, GBP: 0.86, JPY: 162.84, CAD: 1.47, AUD: 1.65, CHF: 0.96, CNY: 7.82, INR: 90.38, MXN: 18.21 },
    GBP: { USD: 1.27, EUR: 1.16, GBP: 1, JPY: 189.35, CAD: 1.71, AUD: 1.92, CHF: 1.11, CNY: 9.1, INR: 105.09, MXN: 21.16 },
    JPY: { USD: 0.0067, EUR: 0.0061, GBP: 0.0053, JPY: 1, CAD: 0.009, AUD: 0.01, CHF: 0.0059, CNY: 0.048, INR: 0.55, MXN: 0.11 },
    CAD: { USD: 0.74, EUR: 0.68, GBP: 0.58, JPY: 110.97, CAD: 1, AUD: 1.12, CHF: 0.65, CNY: 5.32, INR: 61.59, MXN: 12.41 },
    AUD: { USD: 0.66, EUR: 0.61, GBP: 0.52, JPY: 98.57, CAD: 0.89, AUD: 1, CHF: 0.58, CNY: 4.73, INR: 54.7, MXN: 11.02 },
    CHF: { USD: 1.14, EUR: 1.04, GBP: 0.9, JPY: 170.25, CAD: 1.53, AUD: 1.73, CHF: 1, CNY: 8.17, INR: 94.49, MXN: 19.03 },
    CNY: { USD: 0.14, EUR: 0.13, GBP: 0.11, JPY: 20.84, CAD: 0.19, AUD: 0.21, CHF: 0.12, CNY: 1, INR: 11.57, MXN: 2.33 },
    INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.8, CAD: 0.016, AUD: 0.018, CHF: 0.011, CNY: 0.086, INR: 1, MXN: 0.2 },
    MXN: { USD: 0.06, EUR: 0.055, GBP: 0.047, JPY: 8.94, CAD: 0.081, AUD: 0.091, CHF: 0.053, CNY: 0.43, INR: 4.96, MXN: 1 }
  };

  // Initialize last updated timestamp
  useEffect(() => {
    setLastUpdated(new Date().toLocaleString());
  }, []);

  // Convert when inputs change
  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      convert();
    }
  }, [amount, fromCurrency, toCurrency]);

  // Perform conversion
  const convert = () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setConvertedAmount('');
      setConversionRate(null);
      return;
    }

    const rate = exchangeRates[fromCurrency][toCurrency];
    const result = parseFloat(amount) * rate;
    const formattedResult = formatCurrency(result, toCurrency);
    
    setConvertedAmount(formattedResult);
    setConversionRate(rate);
    
    // Add to history
    const newConversion = {
      from: { amount, currency: fromCurrency },
      to: { amount: result, currency: toCurrency },
      rate,
      timestamp: new Date().toISOString()
    };
    
    setConversionHistory(prevHistory => [newConversion, ...prevHistory.slice(0, 9)]);
  };

  // Format currency based on locale
  const formatCurrency = (value, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: currency === 'JPY' ? 0 : 2,
      maximumFractionDigits: currency === 'JPY' ? 0 : 2
    }).format(value);
  };

  // Reset converter
  const handleReset = () => {
    setAmount('');
    setConvertedAmount('');
    setConversionRate(null);
  };

  // Swap currencies
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    if (convertedAmount) {
      // Extract numeric value from formatted currency string
      const numericValue = parseFloat(convertedAmount.replace(/[^0-9.-]+/g, ''));
      setAmount(numericValue.toString());
      setConvertedAmount('');
    }
  };
  
  // Toggle history visibility
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };
  
  // Clear history
  const clearHistory = () => {
    setConversionHistory([]);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-display font-bold text-center mb-6">Currency Converter</h1>
        
        <div className="calculator-container">
          {/* Disclaimer about static rates */}
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg text-sm text-yellow-800">
            <p className="flex items-start">
              <Info size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>
                This is a simplified converter with static exchange rates for demonstration purposes.
                In a production environment, this would connect to a real-time currency API.
              </span>
            </p>
          </div>
          
          {/* Last updated */}
          <div className="text-right text-xs text-gray-500 mb-4">
            Rates last updated: {lastUpdated}
            <button
              onClick={() => setLastUpdated(new Date().toLocaleString())}
              className="ml-2 text-primary-600 hover:text-primary-700"
              aria-label="Refresh rates"
            >
              <RefreshCw size={12} />
            </button>
          </div>
          
          {/* Converter form */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="relative">
                <input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="input-field"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {fromCurrency && currencies.find(c => c.code === fromCurrency)?.symbol}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="fromCurrency" className="block text-sm font-medium text-gray-700 mb-1">
                  From
                </label>
                <select
                  id="fromCurrency"
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="input-field"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="toCurrency" className="block text-sm font-medium text-gray-700 mb-1">
                  To
                </label>
                <select
                  id="toCurrency"
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="input-field"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Swap button */}
            <div className="flex justify-center">
              <button
                onClick={handleSwapCurrencies}
                className="p-2 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors"
                aria-label="Swap currencies"
              >
                <ArrowRightLeft size={20} className="text-primary-600" />
              </button>
            </div>
            
            {/* Result */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-500">Converted Amount</p>
                <p className="text-2xl font-bold">
                  {convertedAmount || '-'}
                </p>
                {conversionRate && (
                  <p className="text-xs text-gray-500 mt-1">
                    1 {fromCurrency} = {conversionRate.toFixed(4)} {toCurrency}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleReset}
                className="btn btn-outline flex items-center"
              >
                <RotateCcw size={16} className="mr-2" />
                Reset
              </button>
            </div>
          </div>
          
          {/* Common conversions */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Popular Exchange Rates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-gray-700">1 USD =</p>
                <ul className="mt-1 space-y-1 text-gray-600">
                  <li>{exchangeRates.USD.EUR.toFixed(2)} EUR</li>
                  <li>{exchangeRates.USD.GBP.toFixed(2)} GBP</li>
                  <li>{exchangeRates.USD.JPY.toFixed(2)} JPY</li>
                  <li>{exchangeRates.USD.CAD.toFixed(2)} CAD</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-gray-700">1 EUR =</p>
                <ul className="mt-1 space-y-1 text-gray-600">
                  <li>{exchangeRates.EUR.USD.toFixed(2)} USD</li>
                  <li>{exchangeRates.EUR.GBP.toFixed(2)} GBP</li>
                  <li>{exchangeRates.EUR.JPY.toFixed(2)} JPY</li>
                  <li>{exchangeRates.EUR.CHF.toFixed(2)} CHF</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Conversion history toggle */}
          <div className="mt-6 text-center">
            <button 
              onClick={toggleHistory}
              className="text-primary-600 text-sm flex items-center mx-auto"
            >
              <ArrowRightLeft size={14} className="mr-1" />
              {showHistory ? 'Hide' : 'Show'} Conversion History
            </button>
          </div>
          
          {/* Conversion history */}
          {showHistory && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-4 border-t pt-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold">Recent Conversions</h3>
                {conversionHistory.length > 0 && (
                  <button 
                    onClick={clearHistory}
                    className="text-xs text-red-500"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              <div className="max-h-40 overflow-y-auto">
                {conversionHistory.length > 0 ? (
                  <ul className="space-y-2">
                    {conversionHistory.map((conversion, index) => (
                      <li key={index} className="text-sm">
                        <div className="flex justify-between">
                          <span>
                            {formatCurrency(conversion.from.amount, conversion.from.currency)} = {formatCurrency(conversion.to.amount, conversion.to.currency)}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {new Date(conversion.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No conversion history yet.</p>
                )}
              </div>
            </motion.div>
          )}
          
          {/* Toggle info button */}
          <div className="mt-6 text-center">
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className="text-primary-600 text-sm flex items-center mx-auto"
            >
              <Info size={14} className="mr-1" />
              {showInfo ? 'Hide' : 'Show'} Information
            </button>
          </div>
          
          {/* Currency information */}
          {showInfo && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-4 text-sm text-gray-600 border-t pt-4"
            >
              <h3 className="font-medium text-gray-800 mb-2">About Currency Exchange:</h3>
              <p className="mb-2">
                Currency exchange rates fluctuate continuously based on global economic factors,
                including inflation rates, interest rates, political stability, and market speculation.
              </p>
              <p className="mb-2">
                When traveling or doing business internationally, it's important to check current exchange rates
                from reliable sources such as banks or authorized currency exchange services.
              </p>
              <p>
                Exchange rates typically include fees or spreads that vary by provider, so the actual rate you
                receive may differ from the mid-market rate shown in currency converters.
              </p>
            </motion.div>
          )}
        </div>
        
        {/* User Guide Section */}
        <div className="guide-section mt-12">
          <h2 className="text-xl font-semibold mb-4">Currency Converter Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">How to Use</h3>
              <ol className="space-y-2 text-gray-700 list-decimal list-inside">
                <li>Enter the amount you want to convert</li>
                <li>Select the currency you're converting from</li>
                <li>Select the currency you want to convert to</li>
                <li>The converted amount will appear automatically</li>
                <li>Use the swap button to reverse the conversion</li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Currency Basics</h3>
              <ul className="space-y-2 text-gray-700">
                <li><span className="font-medium">Exchange Rate:</span> The value of one currency expressed in terms of another</li>
                <li><span className="font-medium">Base Currency:</span> The first currency in a currency pair (the one you're converting from)</li>
                <li><span className="font-medium">Quote Currency:</span> The second currency in a pair (the one you're converting to)</li>
                <li><span className="font-medium">Spread:</span> The difference between buying and selling rates, representing the dealer's profit</li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Tips for Currency Exchange</h3>
            <ul className="space-y-1 text-gray-700 list-disc list-inside">
              <li>Compare rates from different providers before exchanging money</li>
              <li>Be aware of additional fees that may not be included in the quoted exchange rate</li>
              <li>Currency exchange rates at airports and tourist areas are typically less favorable</li>
              <li>Consider using credit cards with no foreign transaction fees when traveling</li>
              <li>For large transactions, consider using specialized money transfer services</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CurrencyConverter;