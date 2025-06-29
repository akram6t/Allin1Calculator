import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, DollarSign, ArrowRight, Info } from "lucide-react";
import { RotateCcw } from "lucide-react";

const TaxCalculator = () => {
  const [income, setIncome] = useState("");
  const [filingStatus, setFilingStatus] = useState("single");
  const [taxResults, setTaxResults] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  // US tax brackets for 2023 (simplified)
  const taxBrackets = {
    single: [
      { rate: 0.1, min: 0, max: 11000 },
      { rate: 0.12, min: 11001, max: 44725 },
      { rate: 0.22, min: 44726, max: 95375 },
      { rate: 0.24, min: 95376, max: 182100 },
      { rate: 0.32, min: 182101, max: 231250 },
      { rate: 0.35, min: 231251, max: 578125 },
      { rate: 0.37, min: 578126, max: Infinity },
    ],
    married: [
      { rate: 0.1, min: 0, max: 22000 },
      { rate: 0.12, min: 22001, max: 89450 },
      { rate: 0.22, min: 89451, max: 190750 },
      { rate: 0.24, min: 190751, max: 364200 },
      { rate: 0.32, min: 364201, max: 462500 },
      { rate: 0.35, min: 462501, max: 693750 },
      { rate: 0.37, min: 693751, max: Infinity },
    ],
    head: [
      { rate: 0.1, min: 0, max: 15700 },
      { rate: 0.12, min: 15701, max: 59850 },
      { rate: 0.22, min: 59851, max: 95350 },
      { rate: 0.24, min: 95351, max: 182100 },
      { rate: 0.32, min: 182101, max: 231250 },
      { rate: 0.35, min: 231251, max: 578100 },
      { rate: 0.37, min: 578101, max: Infinity },
    ],
  };

  const [currency, setCurrency] = useState("INR"); // Add currency selector

  const currencyRates = {
    USD: 0.012,
    INR: 1, // base
    EUR: 0.011,
  };

  const getCurrencySymbol = (code) =>
    ({
      USD: "$",
      INR: "₹",
      EUR: "€",
    }[code] || "$");

  //curry format
  const formatCurrency = (value) => {
    const rate = 1 / (currencyRates[currency] || 1); // Convert FROM USD
    const converted = parseFloat(value) * rate;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(converted);
  };

  // Standard deductions for 2025
  const standardDeduction = {
    single: 14600,
    married: 29200,
    head: 21900,
  };

  // Calculate taxes
  const calculateTaxes = () => {
    if (!income) return;

    const incomeValue = parseFloat(income);
    const taxableIncome = Math.max(
      0,
      incomeValue - standardDeduction[filingStatus]
    );

    let totalTax = 0;
    let marginalRate = 0;
    let brackets = [];

    // Calculate tax by bracket
    const currentBrackets = taxBrackets[filingStatus];

    for (let i = 0; i < currentBrackets.length; i++) {
      const bracket = currentBrackets[i];

      if (taxableIncome > bracket.min) {
        const taxableInBracket =
          Math.min(bracket.max, taxableIncome) - bracket.min;
        const taxInBracket = taxableInBracket * bracket.rate;
        totalTax += taxInBracket;

        brackets.push({
          rate: (bracket.rate * 100).toFixed(1),
          min: bracket.min,
          max: bracket.max,
          taxable: taxableInBracket.toFixed(2),
          tax: taxInBracket.toFixed(2),
        });

        // Set marginal rate (highest bracket rate)
        marginalRate = bracket.rate;

        // If we've reached the income, stop
        if (taxableIncome <= bracket.max) {
          break;
        }
      }
    }

    // Effective tax rate
    const effectiveRate = totalTax / incomeValue;

    setTaxResults({
      income: incomeValue.toFixed(2),
      standardDeduction: standardDeduction[filingStatus].toFixed(2),
      taxableIncome: taxableIncome.toFixed(2),
      totalTax: totalTax.toFixed(2),
      afterTaxIncome: (incomeValue - totalTax).toFixed(2),
      marginalRate: (marginalRate * 100).toFixed(1),
      effectiveRate: (effectiveRate * 100).toFixed(1),
      brackets: brackets,
    });
  };

  // Reset calculator
  const handleReset = () => {
    setIncome("");
    setFilingStatus("single");
    setTaxResults(null);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-display font-bold text-center mb-6">
          Tax Calculator
        </h1>

        <p className="text-sm text-gray-600 text-center mt-2">
          All calculations are based on <span className="font-semibold text-primary-600">INR (Indian Rupee)</span> as the base currency.
        </p>

        <div className="calculator-container max-w-2xl">
          {/* Input form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="income"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Annual Income
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">
                    {getCurrencySymbol(currency)}
                  </span>
                </div>
                <input
                  id="income"
                  type="number"
                  min="0"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="Enter your income"
                  className="input-field pl-7"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Currency
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="input-field"
              >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="filingStatus"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Filing Status
              </label>
              <select
                id="filingStatus"
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value)}
                className="input-field"
              >
                <option value="single">Single</option>
                <option value="married">Married Filing Jointly</option>
                <option value="head">Head of Household</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button onClick={calculateTaxes} className="btn btn-primary">
              Calculate Taxes
            </button>
            <button
                onClick={handleReset}
                className="btn btn-outline flex items-center"
              >
                <RotateCcw size={16} className="mr-2" />
                Reset
              </button>
          </div>

          {/* Results */}
          {taxResults && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Calculator size={24} className="text-primary-600" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Gross Income</p>
                    <p className="text-xl font-bold">
                      {formatCurrency(taxResults.income)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Standard Deduction</p>
                    <p className="text-xl font-medium text-gray-800">
                      {formatCurrency(taxResults.standardDeduction)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Taxable Income</p>
                    <p className="text-xl font-medium text-gray-800">
                      {formatCurrency(taxResults.taxableIncome)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Tax</p>
                    <p className="text-xl font-bold text-red-600">
                      {formatCurrency(taxResults.totalTax)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">After-Tax Income</p>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(taxResults.afterTaxIncome)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Effective Tax Rate</p>
                    <p className="text-xl font-medium text-gray-800">
                      {taxResults.effectiveRate}%
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">
                    Tax Breakdown by Bracket
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Rate
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Bracket Range
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Taxable Amount
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Tax
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {taxResults.brackets.map((bracket, index) => (
                          <tr
                            key={index}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-800">
                              {bracket.rate}%
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                              {formatCurrency(bracket.min)} -{" "}
                              {bracket.max === Infinity
                                ? "∞"
                                : formatCurrency(bracket.max)}
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-800">
                              {formatCurrency(bracket.taxable)}
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-800">
                              {formatCurrency(bracket.tax)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg text-sm text-yellow-800">
                    <p className="flex items-start">
                      <Info size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        This is a simplified tax calculator for illustrative
                        purposes. Actual tax calculations may include additional
                        deductions, credits, and state/local taxes.
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Info button */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="text-primary-600 text-sm flex items-center mx-auto"
                >
                  <Info size={14} className="mr-1" />
                  {showInfo ? "Hide" : "Show"} Tax Information
                </button>
              </div>

              {/* Tax information */}
              {showInfo && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 text-sm text-gray-600 border-t pt-4"
                >
                  <h3 className="font-medium text-gray-800 mb-2">
                    Understanding Tax Terms:
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <span className="font-medium text-gray-700">
                        Gross Income:
                      </span>{" "}
                      Total income before any deductions or taxes.
                    </li>
                    <li>
                      <span className="font-medium text-gray-700">
                        Standard Deduction:
                      </span>{" "}
                      A fixed amount that reduces your taxable income based on
                      your filing status.
                    </li>
                    <li>
                      <span className="font-medium text-gray-700">
                        Taxable Income:
                      </span>{" "}
                      The amount of income subject to taxes after deductions.
                    </li>
                    <li>
                      <span className="font-medium text-gray-700">
                        Marginal Tax Rate:
                      </span>{" "}
                      The tax rate applied to your last dollar of income (your
                      highest tax bracket).
                    </li>
                    <li>
                      <span className="font-medium text-gray-700">
                        Effective Tax Rate:
                      </span>{" "}
                      The average rate at which your income is taxed (total tax
                      divided by gross income).
                    </li>
                  </ul>

                  <h3 className="font-medium text-gray-800 mt-4 mb-2">
                    How Progressive Tax Brackets Work:
                  </h3>
                  <p className="mb-2">
                    The U.S. uses a progressive tax system, meaning different
                    portions of your income are taxed at different rates. For
                    example, if you're in the 22% tax bracket, not all of your
                    income is taxed at 22% - only the portion that falls within
                    that bracket.
                  </p>
                  <div className="flex items-center my-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <DollarSign size={16} className="text-blue-600" />
                    </div>
                    <ArrowRight size={16} className="mx-2 text-gray-400" />
                    <div className="flex-1 h-8 bg-gradient-to-r from-blue-100 via-green-100 to-red-100 rounded-full flex items-center justify-between px-3">
                      <span className="text-xs">10%</span>
                      <span className="text-xs">Higher Rates</span>
                      <span className="text-xs">37%</span>
                    </div>
                  </div>
                  <p>
                    This calculator uses 2023 federal tax brackets and standard
                    deductions. State taxes, itemized deductions, and tax
                    credits are not included.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>

        {/* User Guide Section */}
        <div className="guide-section mt-12">
          <h2 className="text-xl font-semibold mb-4">Tax Calculator Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">How to Use</h3>
              <ol className="space-y-2 text-gray-700 list-decimal list-inside">
                <li>Enter your annual gross income (Before Taxes)</li>
                <li>Select your filing status from the dropdown</li>
                <li>
                  Click "Calculate Taxes" to see your estimated tax breakdown
                </li>
                <li>Use the "Reset" button to start a new calculation</li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">
                Filing Status Explained
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <span className="font-medium">Single:</span> Unmarried
                  individuals or married individuals who are legally separated
                </li>
                <li>
                  <span className="font-medium">Married Filing Jointly:</span>{" "}
                  Married couples who combine their income
                </li>
                <li>
                  <span className="font-medium">Head of Household:</span>{" "}
                  Unmarried individuals who pay more than half the cost of
                  keeping up a home for a qualifying person
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Limitations</h3>
            <ul className="space-y-1 text-gray-700 list-disc list-inside">
              <li>This calculator provides federal tax estimates only</li>
              <li>State and local taxes are not included</li>
              <li>
                The calculator uses the standard deduction and doesn't account
                for itemized deductions
              </li>
              <li>
                Tax credits like Child Tax Credit or Earned Income Credit are
                not included
              </li>
              <li>
                For comprehensive tax planning, consult a tax professional
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaxCalculator;
