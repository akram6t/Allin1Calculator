import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Coins, Info } from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";

// Register chart components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SipCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState("");
  const [annualReturn, setAnnualReturn] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [totalInvestment, setTotalInvestment] = useState(null);
  const [estimatedReturns, setEstimatedReturns] = useState(null);
  const [totalValue, setTotalValue] = useState(null);
  const [yearlyBreakdown, setYearlyBreakdown] = useState([]);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Currency exchange rates (relative to INR)
  const currencyRates = {
    USD: 0.012, // 1 INR = 0.012 USD (approx)
    INR: 1, // Base currency is INR
    EUR: 0.011, // 1 INR = 0.011 EUR (approx)
  };

  // Get currency symbol based on selected currency code
  const getCurrencySymbol = (code) =>
    ({
      USD: "$",
      INR: "₹",
      EUR: "€",
    }[code] || "$");

  // Format numbers as currency using Intl.NumberFormat with conversion
  const formatCurrency = (value) => {
    const rate = currencyRates[currency] || 1;
    const converted = Number(value) * rate;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(converted);
  };

  // Automatically recalculate SIP when inputs change
  useEffect(() => {
    if (monthlyInvestment && annualReturn && timePeriod) {
      calculateSIP();
    }
  }, [monthlyInvestment, annualReturn, timePeriod]);

  // Main SIP calculation logic
  const calculateSIP = () => {
    const principal = parseFloat(monthlyInvestment);
    const rate = parseFloat(annualReturn) / 100 / 12;
    const time = parseFloat(timePeriod) * 12;
    if (
      isNaN(principal) ||
      isNaN(rate) ||
      isNaN(time) ||
      principal <= 0 ||
      time <= 0
    )
      return;

    const amount =
      principal * (((Math.pow(1 + rate, time) - 1) / rate) * (1 + rate));
    const invested = principal * time;
    const returns = amount - invested;

    setTotalInvestment(Number(invested));
    setEstimatedReturns(Number(returns));
    setTotalValue(Number(amount));
    calculateYearlyBreakdown(principal, rate, time);
  };

  // Break SIP data down by year for chart and table display
  const calculateYearlyBreakdown = (principal, rate, totalMonths) => {
    let data = [],
      invested = 0,
      currentValue = 0;
    for (let m = 1; m <= totalMonths; m++) {
      invested += principal;
      currentValue = (currentValue + principal) * (1 + rate);
      if (m % 12 === 0 || m === totalMonths) {
        data.push({
          year: Math.ceil(m / 12),
          investedAmount: Number(invested),
          estimatedReturns: Number(currentValue - invested),
          totalValue: Number(currentValue),
        });
      }
    }
    setYearlyBreakdown(data);
  };

  // Function: Reset all inputs and results
  const handleReset = () => {
    setMonthlyInvestment("");
    setAnnualReturn("");
    setTimePeriod("");
    setTotalInvestment(null);
    setEstimatedReturns(null);
    setTotalValue(null);
    setYearlyBreakdown([]);
  };

  // Chart Data: Pie chart for investment vs returns
  const pieData = {
    labels: ["Investment", "Returns"],
    datasets: [
      {
        data: [
          parseFloat(totalInvestment || 0),
          parseFloat(estimatedReturns || 0),
        ],
        backgroundColor: ["#3B82F6", "#10B981"],
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };

  // Chart Data: Line chart for SIP growth over time
  const growthChartData = {
    labels: yearlyBreakdown.map((item) => `Year ${item.year}`),
    datasets: [
      {
        label: "Investment",
        data: yearlyBreakdown.map((item) => parseFloat(item.investedAmount)),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.1)",
        fill: true,
        tension: 0.2,
      },
      {
        label: "Total Value",
        data: yearlyBreakdown.map((item) => parseFloat(item.totalValue)),
        borderColor: "#10B981",
        backgroundColor: "rgba(16,185,129,0.1)",
        fill: true,
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="px-4 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-center mb-6">SIP Calculator</h1>
        <p className="text-sm text-gray-600 text-center mt-2">
          All calculations are based on <span className="font-semibold text-primary-600">INR (Indian Rupee)</span> as the base currency.
        </p>

        <div className="calculator-container max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Monthly Investment
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">
                    {getCurrencySymbol(currency)}
                  </span>
                </div>
                <input
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
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Expected Annual Return (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  max="100"
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
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Time Period (years)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                placeholder="Enter time period"
                className="input-field"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="input-field"
              >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={handleReset} className="btn btn-outline w-full">
                Reset
              </button>
            </div>
          </div>

          {totalValue && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

  {/* Amount Invested */}
  <div className="bg-blue-50 p-3 rounded-lg text-center">
    <DollarSign size={18} className="text-blue-600 mx-auto mb-1" />
    <p className="text-xs text-gray-500 uppercase">Amount Invested</p>
    <div className="overflow-x-auto max-w-full">
      <div className="flex justify-center w-full">
        <p className="text-xl font-bold whitespace-nowrap w-max">
          {formatCurrency(totalInvestment)}
        </p>
      </div>
    </div>
  </div>

  {/* Estimated Returns */}
  <div className="bg-green-50 p-3 rounded-lg text-center">
    <TrendingUp size={18} className="text-green-600 mx-auto mb-1" />
    <p className="text-xs text-gray-500 uppercase">Estimated Returns</p>
    <div className="overflow-x-auto max-w-full">
      <div className="flex justify-center w-full">
        <p className="text-xl font-bold whitespace-nowrap w-max">
          {formatCurrency(estimatedReturns)}
        </p>
      </div>
    </div>
  </div>

  {/* Total Value */}
  <div className="bg-purple-50 p-3 rounded-lg text-center">
    <Coins size={18} className="text-purple-600 mx-auto mb-1" />
    <p className="text-xs text-gray-500 uppercase">Total Value</p>
    <div className="overflow-x-auto max-w-full">
      <div className="flex justify-center w-full">
        <p className="text-xl font-bold whitespace-nowrap w-max">
          {formatCurrency(totalValue)}
        </p>
      </div>
    </div>
  </div>

</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-2">
                    Investment Breakdown
                  </h3>
                  <div
                    className="w-full"
                    style={{
                      minHeight: "250px",
                      maxWidth: "300px",
                      margin: "0 auto",
                    }}
                  >
                    <Pie
                      data={pieData}
                      options={{ maintainAspectRatio: false }}
                    />
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm overflow-x-auto">
                  <h3 className="text-lg font-medium mb-2">
                    Growth Projection
                  </h3>
                  <div style={{ height: "250px" }}>
                    <Line
                      data={growthChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: "top" } },
                        scales: {
                          y: {
                            ticks: {
                              callback: (value) =>
                                `${getCurrencySymbol(
                                  currency
                                )}${value.toLocaleString()}`,
                            },
                          },
                        },
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
                  {showBreakdown ? "Hide" : "Show"} Yearly Breakdown
                </button>
              </div>

              {/* Yearly breakdown */}
              {showBreakdown && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 overflow-x-auto"
                >
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Year
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount Invested
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Estimated Returns
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {yearlyBreakdown.map((year, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
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
                  {showInfo ? "Hide" : "Show"} SIP Information
                </button>
              </div>

              {/* SIP information */}
              {showInfo && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 text-sm text-gray-600 border-t pt-4"
                >
                  <h3 className="font-medium text-gray-800 mb-2">
                    Understanding SIP (Systematic Investment Plan):
                  </h3>
                  <p className="mb-2">
                    A Systematic Investment Plan (SIP) is an investment strategy
                    where you invest a fixed amount at regular intervals,
                    typically monthly, in mutual funds or other investment
                    vehicles.
                  </p>
                  <p className="mb-2">
                    SIPs work on the principle of rupee-cost averaging, which
                    helps mitigate market volatility by spreading investments
                    over time, resulting in a lower average cost per unit in the
                    long run.
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
                    <li>
                      n = Total number of monthly investments (investment period
                      in years × 12)
                    </li>
                  </ul>
                  <p>
                    This calculation assumes a constant rate of return
                    throughout the investment period. Actual returns may vary
                    due to market conditions and fund performance.
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
                <li>
                  Results will calculate automatically, showing your projected
                  returns
                </li>
                <li>
                  View the yearly breakdown to see how your investment grows
                  over time
                </li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">
                Benefits of SIP Investing
              </h3>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                <li>
                  Disciplined investing approach that removes emotional
                  decision-making
                </li>
                <li>Rupee-cost averaging helps mitigate market volatility</li>
                <li>
                  The power of compounding works in your favor over the long
                  term
                </li>
                <li>
                  Flexibility to start with small amounts and increase over time
                </li>
                <li>
                  Potential for substantial wealth creation over long investment
                  horizons
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Tips for SIP Investing</h3>
            <ul className="space-y-1 text-gray-700 list-disc list-inside">
              <li>Start early to maximize the benefits of compounding</li>
              <li>
                Stay consistent and avoid stopping your SIPs during market
                downturns
              </li>
              <li>
                Consider step-up SIPs where you increase your investment amount
                periodically
              </li>
              <li>
                Diversify your SIP investments across different asset classes
              </li>
              <li>
                Review your SIP portfolio periodically, but avoid frequent
                changes
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SipCalculator;
