import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, PiggyBank, Info, BarChart } from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [showAmortization, setShowAmortization] = useState(false);
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [currency, setCurrency] = useState("INR"); // ✅ Currency state

  // Calculate loan details when inputs change
  useEffect(() => {
    if (loanAmount && interestRate && loanTerm) {
      calculateLoan();
    }
  }, [loanAmount, interestRate, loanTerm]);

  // Calculate monthly payment, total payment, and total interest
  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
    const time = parseFloat(loanTerm) * 12; // Total months

    if (principal <= 0 || rate <= 0 || time <= 0) return;

    const x = Math.pow(1 + rate, time);
    const monthly = (principal * x * rate) / (x - 1);

    const totalPay = monthly * time;
    const totalInt = totalPay - principal;

    setMonthlyPayment(monthly.toFixed(2));
    setTotalPayment(totalPay.toFixed(2));
    setTotalInterest(totalInt.toFixed(2));

    // Calculate amortization schedule
    calculateAmortizationSchedule(principal, rate, time, monthly);
  };

  // Generate amortization schedule
  const calculateAmortizationSchedule = (
    principal,
    rate,
    time,
    monthlyPayment
  ) => {
    let balance = principal;
    let schedule = [];

    for (let i = 1; i <= time; i++) {
      const interestPayment = balance * rate;
      const principalPayment = monthlyPayment - interestPayment;

      balance -= principalPayment;

      // Ensure balance doesn't go below zero due to rounding errors
      if (balance < 0) balance = 0;

      schedule.push({
        month: i,
        principalPayment: principalPayment.toFixed(2),
        interestPayment: interestPayment.toFixed(2),
        balance: balance.toFixed(2),
      });
    }

    setAmortizationSchedule(schedule);
  };

  // Reset calculator
  const handleReset = () => {
    setLoanAmount("");
    setInterestRate("");
    setLoanTerm("");
    setMonthlyPayment(null);
    setTotalPayment(null);
    setTotalInterest(null);
    setAmortizationSchedule([]);
  };

  // Chart data for pie chart
  const pieData = {
    labels: ["Principal", "Interest"],
    datasets: [
      {
        data: [parseFloat(loanAmount || 0), parseFloat(totalInterest || 0)],
        backgroundColor: ["#10B981", "#EF4444"],
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };

  // Chart data for amortization chart (yearly summary)
  const getYearlyAmortizationData = () => {
    if (!amortizationSchedule.length) return null;

    const yearlySummary = [];
    const years = Math.ceil(amortizationSchedule.length / 12);

    for (let i = 0; i < years; i++) {
      const startMonth = i * 12;
      const endMonth = Math.min(
        startMonth + 11,
        amortizationSchedule.length - 1
      );

      let yearlyPrincipal = 0;
      let yearlyInterest = 0;

      for (let j = startMonth; j <= endMonth; j++) {
        if (amortizationSchedule[j]) {
          yearlyPrincipal += parseFloat(
            amortizationSchedule[j].principalPayment
          );
          yearlyInterest += parseFloat(amortizationSchedule[j].interestPayment);
        }
      }

      yearlySummary.push({
        year: i + 1,
        principal: yearlyPrincipal,
        interest: yearlyInterest,
      });
    }

    return {
      labels: yearlySummary.map((item) => `Year ${item.year}`),
      datasets: [
        {
          label: "Principal",
          data: yearlySummary.map((item) => item.principal),
          backgroundColor: "#10B981",
        },
        {
          label: "Interest",
          data: yearlySummary.map((item) => item.interest),
          backgroundColor: "#EF4444",
        },
      ],
    };
  };

  // Currency exchange rates (relative to USD)
  const currencyRates = {
    USD: 0.012, // 1 INR = 0.012 USD (approx)
    INR: 1,     // Base currency is INR
    EUR: 0.011  // 1 INR = 0.011 EUR (approx)
  };

  // Format currency
  const formatCurrency = (value) => {
    const rate = currencyRates[currency] || 1;
    const converted = value * rate;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(converted);
  };


  // ✅ Get currency symbol
  const getCurrencySymbol = (currencyCode) => {
    const symbols = {
      USD: "$",
      INR: "₹",
      EUR: "€",
    };
    return symbols[currencyCode] || "$";
  };


  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-display font-bold text-center mb-6">
          Loan EMI Calculator
        </h1>
        <p className="text-sm text-gray-600 text-center mt-2">
          All calculations are based on <span className="font-semibold text-primary-600">INR (Indian Rupee)</span> as the base currency.
        </p>

        <div className="calculator-container max-w-2xl">
          {/* Input form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="loanAmount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Loan Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">{getCurrencySymbol(currency)}</span>
                </div>
                <input
                  id="loanAmount"
                  type="number"
                  min="0"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="Enter loan amount"
                  className="input-field pl-7"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="interestRate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Interest Rate (% per year)
              </label>
              <div className="relative">
                <input
                  id="interestRate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="Enter interest rate"
                  className="input-field pr-7"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="loanTerm"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Loan Term (years)
              </label>
              <input
                id="loanTerm"
                type="number"
                min="1"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                placeholder="Enter loan term"
                className="input-field"
              />
            </div>

            {/* ✅ Currency Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="input-field bg-white"
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

          {/* Results */}
          {monthlyPayment && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >

              <div className="flex gap-4 flex-wrap justify-center">

                {/* Monthly Payment */}
                <div className="w-[180px] bg-primary-50 p-4 rounded-lg text-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Wallet size={20} className="text-primary-600" />
                  </div>
                  <p className="text-xs text-gray-500 uppercase">Monthly Payment</p>
                  <div className="overflow-x-auto max-w-full">
                    <p className="text-xl font-bold text-gray-800 whitespace-nowrap">
                      {formatCurrency(monthlyPayment)}
                    </p>
                  </div>
                </div>

                {/* Total Payment */}
                <div className="w-[180px] bg-yellow-100 p-4 rounded-lg text-center">
                  <div className="w-10 h-10 bg-yellow-300 rounded-full flex items-center justify-center mx-auto mb-2">
                    <PiggyBank size={20} className="text-pink-600" />
                  </div>
                  <p className="text-xs text-gray-500 uppercase">Total Payment</p>
                  <div className="overflow-x-auto max-w-full">
                    <p className="text-xl font-bold text-gray-800 whitespace-nowrap">
                      {formatCurrency(totalPayment)}
                    </p>
                  </div>
                </div>

                {/* Total Interest */}
                <div className="w-[180px] bg-red-50 p-4 rounded-lg text-center">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Info size={20} className="text-red-600" />
                  </div>
                  <p className="text-xs text-gray-500 uppercase">Total Interest</p>
                  <div className="overflow-x-auto max-w-full">
                    <p className="text-xl font-bold text-gray-800 whitespace-nowrap">
                      {formatCurrency(totalInterest)}
                    </p>
                  </div>
                </div>

              </div>




              {/* Chart section */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Payment Breakdown</h3>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div
                    className="w-full sm:w-[300px] mx-auto"
                    style={{ height: "250px" }}
                  >
                    <Pie
                      data={pieData}
                      options={{ maintainAspectRatio: false }}
                    />
                  </div>
                </div>
              </div>

              {/* Yearly amortization chart */}
              {getYearlyAmortizationData() && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">
                    Yearly Payment Breakdown
                  </h3>
                  <div className="bg-white p-4 rounded-lg shadow-sm overflow-x-auto">
                    <div
                      className="min-w-[400px]"
                      style={{ height: "300px" }}
                    ></div>
                    <Bar
                      data={getYearlyAmortizationData()}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: "top",
                          },
                          title: {
                            display: true,
                            text: "Yearly Principal vs Interest",
                          },
                        },
                        scales: {
                          x: {
                            stacked: false,
                          },
                          y: {
                            stacked: false,
                            ticks: {
                              callback: function (value) {
                                return getCurrencySymbol(currency) + value.toFixed(0);
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Amortization schedule toggle */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAmortization(!showAmortization)}
                  className="inline-flex items-center text-primary-600 text-sm font-medium"
                >
                  <BarChart size={16} className="mr-1" />
                  {showAmortization ? "Hide" : "Show"} Amortization Schedule
                </button>
              </div>

              {/* Amortization schedule */}
              {showAmortization && (
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
                          Month
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Principal
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Interest
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Remaining Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {amortizationSchedule.map((payment, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                            {payment.month}
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-800">
                            {formatCurrency(payment.principalPayment)}
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-800">
                            {formatCurrency(payment.interestPayment)}
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-800">
                            {formatCurrency(payment.balance)}
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
                  {showInfo ? "Hide" : "Show"} Loan Information
                </button>
              </div>

              {/* Loan information */}
              {showInfo && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 text-sm text-gray-600 border-t pt-4"
                >
                  <h3 className="font-medium text-gray-800 mb-2">
                    Understanding Loan EMI Calculation:
                  </h3>
                  <p className="mb-2">
                    EMI stands for Equated Monthly Installment. It's the amount
                    you pay every month toward your loan, which includes both
                    principal and interest components.
                  </p>
                  <p className="mb-2">
                    The EMI is calculated using the formula: EMI = P × r × (1 +
                    r)ⁿ ÷ [(1 + r)ⁿ - 1], where:
                  </p>
                  <ul className="list-disc list-inside space-y-1 mb-2 pl-4">
                    <li>P = Principal loan amount</li>
                    <li>r = Monthly interest rate (annual rate ÷ 12 ÷ 100)</li>
                    <li>
                      n = Total number of monthly installments (loan term in
                      years × 12)
                    </li>
                  </ul>
                  <p>
                    As you progress through your loan term, the proportion of
                    principal to interest in each EMI changes. Initially, a
                    larger portion goes toward interest, but this gradually
                    shifts toward principal repayment.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>

        {/* User Guide Section */}
        <div className="guide-section mt-12">
          <h2 className="text-xl font-semibold mb-4">
            Loan EMI Calculator Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">How to Use</h3>
              <ol className="space-y-2 text-gray-700 list-decimal list-inside">
                <li>Enter your loan amount (the principal you're borrowing)</li>
                <li>Input the annual interest rate offered by your lender</li>
                <li>Specify the loan term in years</li>
                <li>
                  Results will calculate automatically, showing your monthly
                  payment and total costs
                </li>
                <li>
                  View the amortization schedule to see how payments are
                  distributed over time
                </li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">
                Understanding the Results
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <span className="font-medium">Monthly Payment:</span> The
                  fixed amount you'll pay each month
                </li>
                <li>
                  <span className="font-medium">Total Payment:</span> The sum of
                  all payments over the entire loan term
                </li>
                <li>
                  <span className="font-medium">Total Interest:</span> The total
                  cost of borrowing (Total Payment - Principal)
                </li>
                <li>
                  <span className="font-medium">Amortization Schedule:</span>{" "}
                  Month-by-month breakdown of payments
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">
              Tips for Loan Management
            </h3>
            <ul className="space-y-1 text-gray-700 list-disc list-inside">
              <li>
                Making extra payments toward principal can significantly reduce
                your total interest costs
              </li>
              <li>
                Compare loans with different terms to find the right balance
                between monthly payment and total cost
              </li>
              <li>
                Lower interest rates have a major impact on long-term loans
              </li>
              <li>
                Consider factors beyond EMI, such as prepayment penalties and
                processing fees
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoanCalculator;
