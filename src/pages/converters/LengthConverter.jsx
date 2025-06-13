import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, RotateCcw, ArrowDown } from 'lucide-react';

const LengthConverter = () => {
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('foot');
  const [conversionHistory, setConversionHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Conversion factors to meters (base unit)
  const conversionFactors = {
    meter: 1,
    kilometer: 1000,
    centimeter: 0.01,
    millimeter: 0.001,
    inch: 0.0254,
    foot: 0.3048,
    yard: 0.9144,
    mile: 1609.34,
    nauticalMile: 1852,
  };

  // Pretty names for display
  const unitNames = {
    meter: 'Meter (m)',
    kilometer: 'Kilometer (km)',
    centimeter: 'Centimeter (cm)',
    millimeter: 'Millimeter (mm)',
    inch: 'Inch (in)',
    foot: 'Foot (ft)',
    yard: 'Yard (yd)',
    mile: 'Mile (mi)',
    nauticalMile: 'Nautical Mile (nmi)',
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
    
    // Convert from the source unit to meters, then from meters to the target unit
    const valueInMeters = fromValueNum * conversionFactors[fromUnit];
    const convertedValue = valueInMeters / conversionFactors[toUnit];
    
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
        <h1 className="text-3xl font-display font-bold text-center mb-6">Length Converter</h1>
        
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
                className="btn btn-outline"
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
                <p className="font-medium text-gray-700">1 meter =</p>
                <ul className="mt-1 space-y-1 text-gray-600">
                  <li>100 centimeters</li>
                  <li>3.28084 feet</li>
                  <li>39.3701 inches</li>
                  <li>1.09361 yards</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-gray-700">1 kilometer =</p>
                <ul className="mt-1 space-y-1 text-gray-600">
                  <li>1000 meters</li>
                  <li>0.621371 miles</li>
                  <li>3280.84 feet</li>
                  <li>0.539957 nautical miles</li>
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
          <h2 className="text-xl font-semibold mb-4">Length Converter Guide</h2>
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
              <h3 className="text-lg font-medium mb-2">Length Units Explained</h3>
              <ul className="space-y-2 text-gray-700">
                <li><span className="font-medium">Metric:</span> Meters (m), Kilometers (km), Centimeters (cm), Millimeters (mm)</li>
                <li><span className="font-medium">Imperial/US:</span> Inches (in), Feet (ft), Yards (yd), Miles (mi)</li>
                <li><span className="font-medium">Navigation:</span> Nautical Miles (nmi) - used in air and sea navigation</li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Unit Relationships</h3>
            <ul className="space-y-1 text-gray-700 list-disc list-inside">
              <li>1 meter = 100 centimeters = 1000 millimeters</li>
              <li>1 kilometer = 1000 meters</li>
              <li>1 inch = 2.54 centimeters (exactly)</li>
              <li>1 foot = 12 inches = 30.48 centimeters</li>
              <li>1 yard = 3 feet = 0.9144 meters</li>
              <li>1 mile = 5280 feet = 1.60934 kilometers</li>
              <li>1 nautical mile = 1.852 kilometers (exactly)</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LengthConverter;