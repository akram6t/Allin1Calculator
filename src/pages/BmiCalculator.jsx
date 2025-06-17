import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scale, Info } from 'lucide-react';


const BmiCalculator = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const [unit, setUnit] = useState('metric'); // 'metric' or 'imperial'
  const [showInfo, setShowInfo] = useState(false);

  // Calculate BMI whenever height or weight changes
  useEffect(() => {
    calculateBMI();
  }, [height, weight, unit]);

  // Calculate BMI based on the formula
  const calculateBMI = () => {
    if (height && weight) {
      let bmiValue;
      
      if (unit === 'metric') {
        // Metric formula: weight (kg) / [height (m)]^2
        const heightInMeters = parseFloat(height) / 100;
        bmiValue = parseFloat(weight) / (heightInMeters * heightInMeters);
      } else {
        // Imperial formula: (weight (lbs) * 703) / [height (inches)]^2
        bmiValue = (parseFloat(weight) * 703) / (parseFloat(height) * parseFloat(height));
      }
      
      setBmi(bmiValue.toFixed(1));
      setBmiCategory(getBmiCategory(bmiValue));
    } else {
      setBmi(null);
      setBmiCategory('');
    }
  };

  // Determine BMI category based on value
  const getBmiCategory = (bmiValue) => {
    if (bmiValue < 18.5) {
      return 'Underweight';
    } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
      return 'Normal weight';
    } else if (bmiValue >= 25 && bmiValue < 29.9) {
      return 'Overweight';
    } else {
      return 'Obesity';
    }
  };

  // Get color based on BMI category
  const getBmiColor = () => {
    switch (bmiCategory) {
      case 'Underweight':
        return 'text-blue-500';
      case 'Normal weight':
        return 'text-green-500';
      case 'Overweight':
        return 'text-yellow-500';
      case 'Obesity':
        return 'text-red-500';
      default:
        return 'text-gray-800';
    }
  };

  // Reset the calculator
  const handleReset = () => {
    setHeight('');
    setWeight('');
    setBmi(null);
    setBmiCategory('');
  };

  // Toggle unit system
  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
    setHeight('');
    setWeight('');
    setBmi(null);
    setBmiCategory('');
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-display font-bold text-center mb-6">BMI Calculator</h1>
        
        <div className="calculator-container">
          
          {/* Unit toggle */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-l-lg keyboard-focus ${
                  unit === 'metric'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setUnit('metric')}
              >
                Metric (cm/kg)
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-r-lg keyboard-focus ${
                  unit === 'imperial'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setUnit('imperial')}
              >
                Imperial (in/lbs)
              </button>
            </div>
          </div>

          {/* Input form */}
          <div className="space-y-4">
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                Height {unit === 'metric' ? '(cm)' : '(inches)'}
              </label>
              <input
                id="height"
                type="number"
                min="0"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder={unit === 'metric' ? 'Enter height in cm' : 'Enter height in inches'}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Weight {unit === 'metric' ? '(kg)' : '(lbs)'}
              </label>
              <input
                id="weight"
                type="number"
                min="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={unit === 'metric' ? 'Enter weight in kg' : 'Enter weight in lbs'}
                className="input-field"
              />
            </div>
            
            <div className="flex space-x-4 pt-2">
              <button
                onClick={handleReset}
                className="btn btn-outline flex-1"
              >
                Reset
              </button>
              <button
                onClick={toggleUnit}
                className="btn btn-outline flex-1"
              >
                Switch to {unit === 'metric' ? 'Imperial' : 'Metric'}
              </button>
            </div>
          </div>

          {/* Results */}
          {bmi && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-8 p-6 bg-gray-50 rounded-xl text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-sm mb-4">
                <Scale size={32} className="text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your BMI: {bmi}</h2>
              <p className={`text-lg font-medium ${getBmiColor()}`}>
                {bmiCategory}
              </p>
              
              <div className="mt-6">
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500 ease-in-out"
                    style={{
                      width: `${Math.min(100, (bmi / 40) * 100)}%`,
                      backgroundColor: bmi < 18.5 
                        ? '#3B82F6' // blue
                        : bmi < 24.9
                          ? '#10B981' // green
                          : bmi < 29.9
                            ? '#F59E0B' // yellow
                            : '#EF4444' // red
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>18.5</span>
                  <span>24.9</span>
                  <span>29.9</span>
                  <span>40+</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Info button */}
          <div className="mt-4 text-center">
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className="text-primary-600 text-sm flex items-center mx-auto"
            >
              <Info size={14} className="mr-1" />
              {showInfo ? 'Hide' : 'Show'} BMI Information
            </button>
          </div>
          
          {/* BMI information */}
          {showInfo && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-4 text-sm text-gray-600 border-t pt-4"
            >
              <h3 className="font-medium text-gray-800 mb-2">BMI Categories:</h3>
              <ul className="space-y-1">
                <li><span className="inline-block w-32 text-blue-500 font-medium">Underweight:</span> Less than 18.5</li>
                <li><span className="inline-block w-32 text-green-500 font-medium">Normal weight:</span> 18.5 - 24.9</li>
                <li><span className="inline-block w-32 text-yellow-500 font-medium">Overweight:</span> 25 - 29.9</li>
                <li><span className="inline-block w-32 text-red-500 font-medium">Obesity:</span> 30 or greater</li>
              </ul>
              
              <p className="mt-3">
                BMI is a screening tool, but it does not diagnose body fatness or health. A healthcare provider can help you interpret your results.
              </p>
            </motion.div>
          )}
        </div>
        
        {/* User Guide Section */}
        <div className="guide-section mt-12">
          <h2 className="text-xl font-semibold mb-4">BMI Calculator Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">How to Use</h3>
              <ol className="space-y-2 text-gray-700 list-decimal list-inside">
                <li>Select your preferred unit system (Metric or Imperial)</li>
                <li>Enter your height (in centimeters or inches)</li>
                <li>Enter your weight (in kilograms or pounds)</li>
                <li>Your BMI and category will calculate automatically</li>
                <li>Use the reset button to clear all inputs</li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Understanding BMI</h3>
              <p className="text-gray-700 mb-3">
                Body Mass Index (BMI) is a value derived from a person's height and weight. It provides a simple numeric measure of a person's thickness or thinness, allowing health professionals to discuss weight problems more objectively with their patients.
              </p>
              <p className="text-gray-700">
                While BMI is a useful measurement for most people, it's not a perfect method. It doesn't account for factors such as muscle mass, bone density, overall body composition, and racial and sex differences.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">When to Consult a Healthcare Provider</h3>
            <ul className="space-y-1 text-gray-700 list-disc list-inside">
              <li>If your BMI falls outside the normal range (18.5-24.9)</li>
              <li>If you've experienced significant unintentional weight loss or gain</li>
              <li>Before starting any new diet or exercise program</li>
              <li>If you have concerns about your weight or health</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BmiCalculator;