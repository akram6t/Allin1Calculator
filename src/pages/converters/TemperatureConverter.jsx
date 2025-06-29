import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, RotateCcw, ArrowDown, Thermometer } from 'lucide-react';

const TemperatureConverter = () => {
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [fromUnit, setFromUnit] = useState('celsius');
  const [toUnit, setToUnit] = useState('fahrenheit');
  const [conversionHistory, setConversionHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Temperature units and their display names
  const unitNames = {
    celsius: 'Celsius (°C)',
    fahrenheit: 'Fahrenheit (°F)',
    kelvin: 'Kelvin (K)',
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

    const value = parseFloat(fromValue);
    let result;

    // Convert to Celsius first (as the intermediate unit)
    let celsius;
    if (fromUnit === 'celsius') {
      celsius = value;
    } else if (fromUnit === 'fahrenheit') {
      celsius = (value - 32) * (5 / 9);
    } else if (fromUnit === 'kelvin') {
      celsius = value - 273.15;
    }

    // Convert from Celsius to the target unit
    if (toUnit === 'celsius') {
      result = celsius;
    } else if (toUnit === 'fahrenheit') {
      result = (celsius * 9 / 5) + 32;
    } else if (toUnit === 'kelvin') {
      result = celsius + 273.15;
    }

    // Format the result
    const formattedValue = formatNumber(result);
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
    if (Math.abs(num) < 0.01) return num.toFixed(4);
    if (Math.abs(num) < 1) return num.toFixed(3);
    if (Math.abs(num) < 10) return num.toFixed(2);
    if (Math.abs(num) < 100) return num.toFixed(1);
    return num.toFixed(1);
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

  // Get the temperature descriptor (cold, cool, warm, hot)
  const getTemperatureDescriptor = (value, unit) => {
    // Convert to Celsius for comparison
    let celsius;
    if (unit === 'celsius') {
      celsius = parseFloat(value);
    } else if (unit === 'fahrenheit') {
      celsius = (parseFloat(value) - 32) * (5 / 9);
    } else if (unit === 'kelvin') {
      celsius = parseFloat(value) - 273.15;
    }

    if (isNaN(celsius)) return '';
    if (celsius < 0) return 'Freezing 🧊';
    if (celsius < 10) return 'Cold ❄️';
    if (celsius < 20) return 'Cool 🌡️';
    if (celsius < 30) return 'Warm ☀️';
    return 'Hot 🔥';
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-display font-bold text-center mb-6">Temperature Converter</h1>

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
              {fromValue && !isNaN(fromValue) && (
                <div className="mt-1 text-sm text-gray-600">
                  {getTemperatureDescriptor(fromValue, fromUnit)}
                </div>
              )}
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
              {toValue && !isNaN(toValue) && (
                <div className="mt-1 text-sm text-gray-600">
                  {getTemperatureDescriptor(toValue, toUnit)}
                </div>
              )}
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

          {/* Temperature scale visualization */}
          {fromValue && !isNaN(fromValue) && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Temperature Scale</h3>
              <div className="relative h-12 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded-lg overflow-hidden">
                {/* Celsius markers */}
                <div className="absolute top-0 left-0 w-full h-full flex items-end justify-between px-2 text-xs text-white font-medium">
                  <span>-20°C</span>
                  <span>0°C</span>
                  <span>20°C</span>
                  <span>40°C</span>
                  <span>60°C</span>
                </div>
                
                {/* Temperature indicator */}
                {fromUnit === 'celsius' && !isNaN(parseFloat(fromValue)) && (
                  <div 
                    className="absolute top-0 h-full w-1 bg-white"
                    style={{ 
                      left: `${Math.min(100, Math.max(0, ((parseFloat(fromValue) + 20) / 80) * 100))}%`,
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-2 py-1 rounded text-xs">
                      {fromValue}°C
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Common conversions */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Common Temperatures</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <Thermometer size={18} className="text-blue-500 mr-2" />
                  <p className="font-medium text-gray-700">Water Freezing Point</p>
                </div>
                <ul className="mt-1 space-y-1 text-gray-600">
                  <li>0° Celsius</li>
                  <li>32° Fahrenheit</li>
                  <li>273.15 Kelvin</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <Thermometer size={18} className="text-red-500 mr-2" />
                  <p className="font-medium text-gray-700">Water Boiling Point</p>
                </div>
                <ul className="mt-1 space-y-1 text-gray-600">
                  <li>100° Celsius</li>
                  <li>212° Fahrenheit</li>
                  <li>373.15 Kelvin</li>
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
          <h2 className="text-xl font-semibold mb-4">Temperature Converter Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">How to Use</h3>
              <ol className="space-y-2 text-gray-700 list-decimal list-inside">
                <li>Enter a temperature value in the "From" field</li>
                <li>Select the unit you're converting from (Celsius, Fahrenheit, or Kelvin)</li>
                <li>Select the unit you want to convert to</li>
                <li>The converted value will appear automatically</li>
                <li>Use the swap button to reverse the conversion</li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Temperature Scales Explained</h3>
              <ul className="space-y-2 text-gray-700">
                <li><span className="font-medium">Celsius (°C):</span> Water freezes at 0°C and boils at 100°C at standard pressure</li>
                <li><span className="font-medium">Fahrenheit (°F):</span> Water freezes at 32°F and boils at 212°F at standard pressure</li>
                <li><span className="font-medium">Kelvin (K):</span> The scientific scale where 0K is absolute zero (-273.15°C)</li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Conversion Formulas</h3>
            <ul className="space-y-1 text-gray-700 list-disc list-inside">
              <li>Celsius to Fahrenheit: °F = (°C × 9/5) + 32</li>
              <li>Fahrenheit to Celsius: °C = (°F - 32) × 5/9</li>
              <li>Celsius to Kelvin: K = °C + 273.15</li>
              <li>Kelvin to Celsius: °C = K - 273.15</li>
              <li>Fahrenheit to Kelvin: K = (°F - 32) × 5/9 + 273.15</li>
              <li>Kelvin to Fahrenheit: °F = (K - 273.15) × 9/5 + 32</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TemperatureConverter;