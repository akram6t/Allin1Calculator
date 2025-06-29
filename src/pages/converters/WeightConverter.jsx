import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, RotateCcw, ArrowDown } from 'lucide-react';

const WeightConverter = () => {
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [fromUnit, setFromUnit] = useState('kilogram');
  const [toUnit, setToUnit] = useState('pound');
  const [conversionHistory, setConversionHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Conversion factors to kilograms (base unit)
  const conversionFactors = {
    kilogram: 1,
    gram: 0.001,
    milligram: 0.000001,
    metricTon: 1000,
    pound: 0.45359237,
    ounce: 0.0283495,
    stone: 6.35029,
    ton: 907.185,
  };

  // Pretty names for display
  const unitNames = {
    kilogram: 'Kilogram (kg)',
    gram: 'Gram (g)',
    milligram: 'Milligram (mg)',
    metricTon: 'Metric Ton (t)',
    pound: 'Pound (lb)',
    ounce: 'Ounce (oz)',
    stone: 'Stone (st)',
    ton: 'US Ton (short ton)',
  };

  // Convert when inputs change
  useEffect(() => {
    if (fromValue !== '') {
      convert();
    }
  }, [fromValue, fromUnit, toUnit]);

  // Perform conversion
  const convert = () => {
    if (fromValue === '' || isNaN(fromValue)) {
      setToValue('');
      return;
    }

    const fromValueNum = parseFloat(fromValue);
    
    // Convert from the source unit to kilograms, then from kilograms to the target unit
    const valueInKilograms = fromValueNum * conversionFactors[fromUnit];
    const convertedValue = valueInKilograms / conversionFactors[toUnit];
    
    // Format the result based on the decimal places needed
    const formattedValue = formatNumber(convertedValue);
    setToValue(formattedValue);
    
    // Add to history
    const newConversion = {
      from: { value: fromValue, unit: fromUnit },
      to: { value: formattedValue, unit: toUnit },
      timestamp: new Date().toISOString(),
    };
    
    setConversionHistory(prevHistory => [newConversion, ...prevHistory.slice(0, 9)]);
  };

  // Format number based on its size
  const formatNumber = (num) => {
    if (Math.abs(num) < 0.000001) return '0';
    if (Math.abs(num) >= 1000000) return num.toExponential(6);
    
    // Add more decimal places for very small numbers
    if (Math.abs(num) < 0.01) return num.toFixed(6);
    if (Math.abs(num) < 0.1) return num.toFixed(5);
    if (Math.abs(num) < 1) return num.toFixed(4);
    if (Math.abs(num) < 10) return num.toFixed(3);
    if (Math.abs(num) < 100) return num.toFixed(2);
    
    return num.toFixed(2);
  };

  // Reset converter
  const handleReset = () => {
    setFromValue('');
    setToValue('');
  };

  // Swap units
  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
    setToValue(fromValue);
  };
  
  // Toggle history visibility
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };
  
  // Clear history
  const clearHistory = () => {
    setConversionHistory([]);
  };

  // Format the display of a conversion in history
  const formatConversion = (conversion) => {
    return `${conversion.from.value} ${unitNames[conversion.from.unit]} = ${conversion.to.value} ${unitNames[conversion.to.unit]}`;
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-display font-bold text-center mb-6">Weight Converter</h1>
        
        <div className="calculator-container">
          {/* Converter form */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div>
              <label htmlFor="fromValue" className="block text-sm font-medium text-gray-700 mb-1">
                From
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  id="fromValue"
                  type="number"
                  value={fromValue}
                  onChange={(e) => setFromValue(e.target.value)}
                  placeholder="Enter value"
                  className="input-field"
                />
                <select
                  id="fromUnit"
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="input-field"
                >
                  {Object.keys(unitNames).map((unit) => (
                    <option key={unit} value={unit}>
                      {unitNames[unit]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Swap button */}
            <div className="flex justify-center">
              <button
                onClick={handleSwapUnits}
                className="p-2 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors"
                aria-label="Swap units"
              >
                <ArrowDown size={20} className="text-primary-600" />
              </button>
            </div>
            
            <div>
              <label htmlFor="toValue" className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  id="toValue"
                  type="text"
                  value={toValue}
                  readOnly
                  className="input-field bg-gray-50"
                />
                <select
                  id="toUnit"
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="input-field"
                >
                  {Object.keys(unitNames).map((unit) => (
                    <option key={unit} value={unit}>
                      {unitNames[unit]}
                    </option>
                  ))}
                </select>
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
            <h3 className="text-lg font-medium mb-4">Common Conversions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-gray-700">1 kilogram =</p>
                <ul className="mt-1 space-y-1 text-gray-600">
                  <li>1000 grams</li>
                  <li>2.20462 pounds</li>
                  <li>35.274 ounces</li>
                  <li>0.157473 stone</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-gray-700">1 pound =</p>
                <ul className="mt-1 space-y-1 text-gray-600">
                  <li>0.453592 kilograms</li>
                  <li>453.592 grams</li>
                  <li>16 ounces</li>
                  <li>0.0714286 stone</li>
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
                        {formatConversion(conversion)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No conversion history yet.</p>
                )}
              </div>
            </motion.div>
          )}
        </div>
        
        {/* User Guide Section */}
        <div className="guide-section mt-12">
          <h2 className="text-xl font-semibold mb-4">Weight Converter Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">How to Use</h3>
              <ol className="space-y-2 text-gray-700 list-decimal list-inside">
                <li>Enter a value in the "From" field</li>
                <li>Select the unit you're converting from using the dropdown</li>
                <li>Select the unit you want to convert to</li>
                <li>The converted value will appear automatically</li>
                <li>Use the swap button to reverse the conversion</li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Weight Units Explained</h3>
              <ul className="space-y-2 text-gray-700">
                <li><span className="font-medium">Metric:</span> Kilograms (kg), Grams (g), Milligrams (mg), Metric Tons (t)</li>
                <li><span className="font-medium">Imperial/US:</span> Pounds (lb), Ounces (oz), Stone (st), US Tons</li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Unit Relationships</h3>
            <ul className="space-y-1 text-gray-700 list-disc list-inside">
              <li>1 kilogram = 1000 grams = 1,000,000 milligrams</li>
              <li>1 metric ton = 1000 kilograms</li>
              <li>1 pound = 16 ounces = 453.59237 grams</li>
              <li>1 stone = 14 pounds = 6.35029 kilograms</li>
              <li>1 US ton (short ton) = 2000 pounds = 907.185 kilograms</li>
              <li>1 UK ton (long ton) = 2240 pounds = 1016.05 kilograms</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WeightConverter;