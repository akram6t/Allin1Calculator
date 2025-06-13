import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Coins, Info } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SipCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState('');
  const [annualReturn, setAnnualReturn] = useState('');
  const [timePeriod, setTimePeriod] = useState('');
  const [totalInvestment, setTotalInvestment] = useState(null);
  const [estimatedReturns, setEstimatedReturns] = useState(null);
  const [totalValue, setTotalValue] = useState(null);
  const [yearlyBreakdown, setYearlyBreakdown] = useState([]);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Calculate SIP details when inputs change
  useEffect(() => {
    if (monthlyInvestment && annualReturn && timePeriod) {
      calculateSIP();
    }
  }, [monthlyInvestment, annualReturn, timePeriod]);

  // Calculate SIP returns
  const calculateSIP = () => {
    const principal = parseFloat(monthlyInvestment);
    const rate = parseFloat(annualReturn) / 100 / 12; // Monthly interest rate
    const time = parseFloat(timePeriod) * 12; // Total months
    
    if (principal <= 0 || rate <= 0 || time <= 0) return;
    
    // SIP formula: P * [((1 + r)^n - 1) / r] * (1 + r)
    const amount = principal * (((Math.pow(1 + rate, time) - 1) / rate) * (1 + rate));
    
    const totalInvested = principal * time;
    const returns = amount - totalInvested;
    
    setTotalInvestment(totalInvested.toFixed(2));
    setEstimatedReturns(returns.toFixed(2));
    setTotalValue(amount.toFixed(2));
    
    // Calculate yearly breakdown
    calculateYearlyBreakdown(principal, rate, time);
  };
  
  // Generate yearly breakdown
  const calculateYearlyBreakdown = (principal, rate, totalMonths) => {
    let yearlyData = [];
    let currentValue = 0;
    let investedAmount = 0;
    
    for (let month = 1; month <= totalMonths; month++) {
      // Add monthly investment
      investedAmount += principal;
      
      // Calculate interest for the month
      currentValue = (currentValue + principal) * (1 + rate);
      
      // Store yearly data
      if (month % 12 === 0 || month === totalMonths) {
        yearlyData.push({
          year: Math.ceil(month / 12),
          investedAmount: investedAmount.toFixed(2),
          estimatedReturns: (currentValue - investedAmount).toFixed(2),
          totalValue: currentValue.toFixed(2)
        });
      }
    }
    
    setYearlyBreakdown(yearlyData);
  };

  // Reset calculator
  const handleReset = () => {
    setMonthlyInvestment('');
    setAnnualReturn('');
    setTimePeriod('');
    setTotalInvestment(null);
    setEstimatedReturns(null);
    setTotalValue(null);
    setYearlyBreakdown([]);
  };

  // Chart data for pie chart
  const pieData = {
    labels: ['Investment', 'Returns'],
    datasets: [
      {
        data: [parseFloat(totalInvestment || 0), parseFloat(estimatedReturns || 0)],
        backgroundColor: ['#3B82F6', '#10B981'],
        borderWidth: 1,
        hoverOffset: 4
      },
    ],
  };
  
  // Chart data for growth chart
  const growthChartData = {
    labels: yearlyBreakdown.map(item => `Year ${item.year}`),
    datasets: [
      {
        label: 'Investment',
        data: yearlyBreakdown.map(item => parseFloat(item.investedAmount)),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
        fill: true
      },
      {
        label: 'Total Value',
        data: yearlyBreakdown.map(item => parseFloat(item.totalValue)),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.1,
        fill: true
      }
    ]
  };
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-display font-bold text-center mb-6">SIP Calculator</h1>
        
        <div className="calculator-container max-w-2xl">
          {/* Input form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="monthlyInvestment" className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Investment
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  id="monthlyInvestment"
                  type="number"
                  min="0"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(e.target.value)}
                  placeholder="Enter amount"
                  className="input-field pl-7"
                />
              </div>
            </div>
            <div>
              <label htmlFor="annualReturn" className="block text-sm font-medium text-gray-700 mb-1">
                Expected Annual Return (%)
              </label>
              <div className="relative">
                <input
                  id="annualReturn"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(e.target.value)}
                  placeholder="Enter return rate"
                  className="input-field pr-7"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="timePeriod" className="block text-sm font-medium text-gray-700 mb-1">
                Time Period (years)
              </label>
              <input
                id="timePeriod"
                type="number"
                min="1"
                max="50"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                placeholder="Enter time period"
                className="input-field"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleReset}
                className="btn btn-outline w-full"
              >
                Reset
              </button>
            </div>
          </div>
          
          {/* Results */}
          {totalValue && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <DollarSign size={20} className="text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-500 uppercase">Amount Invested</p>
                  <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalInvestment)}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <TrendingUp size={20} className="text-green-600" />
                  </div>
                  <p className="text-xs text-gray-500 uppercase">Estimated Returns</p>
                  <p className="text-2xl font-bold text-gray-800">{formatCurrency(estimatedReturns)}</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Coins size={20} className="text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-500 uppercase">Total Value</p>
                  <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalValue)}</p>
                </div>
              </div>
              
              {/* Chart section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Investment Breakdown</h3>
                  <div className="bg-white p-4 rounded-lg shadow-sm h-full">
                    <div className="max-w-xs mx-auto">
                      <Pie data={pieData} />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Growth Projection</h3>
                  <div className="bg-white p-4 rounded-lg shadow-sm h-full">
                    <Line 
                      data={growthChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                        },
                        scales: {
                          y: {
                            ticks: {
                              callback: function(value) {
                                return '$' + value.toLocaleString();
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Yearly breakdown toggle */}
              <div className="mt-6 text-center">
                <button 
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="inline-flex items-center text-primary-600 text-sm font-medium"
                >
                  <TrendingUp size={16} className="mr-1" />
                  {showBreakdown ? 'Hide' : 'Show'} Yearly Breakdown
                </button>
              </div>
              
              {/* Yearly breakdown */}
              {showBreakdown && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 overflow-x-auto"
                >
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Year
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount Invested
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estimated Returns
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {yearlyBreakdown.map((year, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                            {year.year}
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-800">
                            {formatCurrency(year.investedAmount)}
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-green-600 font-medium">
                            {formatCurrency(year.estimatedReturns)}
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-800 font-medium">
                            {formatCurrency(year.totalValue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}
              
              {/* Info button */}
              <div className="mt-6 text-center">
                <button 
                  onClick={() => setShowInfo(!showInfo)}
                  className="text-primary-600 text-sm flex items-center mx-auto"
                >
                  <Info size={14} className="mr-1" />
                  {showInfo ? 'Hide' : 'Show'} SIP Information
                </button>
              </div>
              
              {/* SIP information */}
              {showInfo && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 text-sm text-gray-600 border-t pt-4"
                >
                  <h3 className="font-medium text-gray-800 mb-2">Understanding SIP (Systematic Investment Plan):</h3>
                  <p className="mb-2">
                    A Systematic Investment Plan (SIP) is an investment strategy where you invest a fixed amount at regular intervals, typically monthly, in mutual funds or other investment vehicles.
                  </p>
                  <p className="mb-2">
                    SIPs work on the principle of rupee-cost averaging, which helps mitigate market volatility by spreading investments over time, resulting in a lower average cost per unit in the long run.
                  </p>
                  <p className="mb-2">
                    The formula used to calculate SIP returns is:
                  </p>
                  <p className="mb-2 pl-4 italic">
                    M × [((1 + r)^n - 1) / r] × (1 + r)
                  </p>
                  <ul className="list-disc list-inside space-y-1 mb-2 pl-4">
                    <li>M = Monthly investment amount</li>
                    <li>r = Monthly rate of return (annual rate ÷ 12 ÷ 100)</li>
                    <li>n = Total number of monthly investments (investment period in years × 12)</li>
                  </ul>
                  <p>
                    This calculation assumes a constant rate of return throughout the investment period. Actual returns may vary due to market conditions and fund performance.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
        
        {/* User Guide Section */}
        <div className="guide-section mt-12">
          <h2 className="text-xl font-semibold mb-4">SIP Calculator Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">How to Use</h3>
              <ol className="space-y-2 text-gray-700 list-decimal list-inside">
                <li>Enter your monthly investment amount</li>
                <li>Input the expected annual return rate (in percentage)</li>
                <li>Specify the investment time period in years</li>
                <li>Results will calculate automatically, showing your projected returns</li>
                <li>View the yearly breakdown to see how your investment grows over time</li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Benefits of SIP Investing</h3>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                <li>Disciplined investing approach that removes emotional decision-making</li>
                <li>Rupee-cost averaging helps mitigate market volatility</li>
                <li>The power of compounding works in your favor over the long term</li>
                <li>Flexibility to start with small amounts and increase over time</li>
                <li>Potential for substantial wealth creation over long investment horizons</li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Tips for SIP Investing</h3>
            <ul className="space-y-1 text-gray-700 list-disc list-inside">
              <li>Start early to maximize the benefits of compounding</li>
              <li>Stay consistent and avoid stopping your SIPs during market downturns</li>
              <li>Consider step-up SIPs where you increase your investment amount periodically</li>
              <li>Diversify your SIP investments across different asset classes</li>
              <li>Review your SIP portfolio periodically, but avoid frequent changes</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SipCalculator;