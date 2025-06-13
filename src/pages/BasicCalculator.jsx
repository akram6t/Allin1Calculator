import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Divide, Plus, Minus, Percent, Delete, RotateCcw, CornerUpLeft } from 'lucide-react';

const BasicCalculator = () => {
  const [displayValue, setDisplayValue] = useState('0');
  const [expression, setExpression] = useState('');
  const [memory, setMemory] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [pendingOperation, setPendingOperation] = useState(null);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        handleNumberInput(e.key);
      } else if (e.key === '.') {
        handleDecimalInput();
      } else if (e.key === '+') {
        handleOperationInput('+');
      } else if (e.key === '-') {
        handleOperationInput('-');
      } else if (e.key === '*') {
        handleOperationInput('×');
      } else if (e.key === '/') {
        handleOperationInput('÷');
      } else if (e.key === '%') {
        handlePercentage();
      } else if (e.key === 'Enter' || e.key === '=') {
        handleCalculate();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression, displayValue]);

  // Handle number input
  const handleNumberInput = (num) => {
    if (displayValue === '0' || displayValue === 'Error') {
      setDisplayValue(num);
      setExpression(num);
    } else {
      setDisplayValue(displayValue + num);
      setExpression(expression + num);
    }
  };

  // Handle decimal input
  const handleDecimalInput = () => {
    // Check if last number already has a decimal
    const parts = displayValue.split(/[\+\-\×\÷]/);
    const lastPart = parts[parts.length - 1];
    
    if (!lastPart.includes('.')) {
      setDisplayValue(displayValue + '.');
      setExpression(expression + '.');
    }
  };

  // Handle operation input
  const handleOperationInput = (operation) => {
    if (displayValue === 'Error') {
      return;
    }
    
    // Replace operator if the last character is already an operator
    if (['+', '-', '×', '÷'].includes(expression.slice(-1))) {
      setDisplayValue(displayValue.slice(0, -1) + operation);
      setExpression(expression.slice(0, -1) + operation);
    } else {
      setDisplayValue(displayValue + operation);
      setExpression(expression + operation);
    }
    setPendingOperation(operation);
  };

  // Calculate result
  const handleCalculate = () => {
    if (!expression || expression === '0' || displayValue === 'Error') {
      return;
    }
    
    try {
      // Format expression for evaluation
      let expressionToEvaluate = expression;
      
      // Replace × and ÷ with * and / for evaluation
      expressionToEvaluate = expressionToEvaluate.replace(/×/g, '*').replace(/÷/g, '/');
      
      // Handle percentage calculations
      if (expressionToEvaluate.includes('%')) {
        const parts = expressionToEvaluate.split(/([\+\-\*\/])/);
        let newExpression = '';
        
        for (let i = 0; i < parts.length; i++) {
          if (parts[i].includes('%')) {
            const percentValue = parseFloat(parts[i]) / 100;
            if (i > 0 && ['+', '-', '*', '/'].includes(parts[i-1])) {
              // Apply percentage to the previous number
              const prevNum = parseFloat(parts[i-2]);
              const operator = parts[i-1];
              let result;
              
              if (operator === '+' || operator === '-') {
                result = prevNum * percentValue;
                newExpression = newExpression.slice(0, -parts[i-2].length-1) + (operator === '+' ? `+${result}` : `-${result}`);
              } else {
                result = percentValue;
                newExpression += result;
              }
            } else {
              newExpression += percentValue;
            }
          } else {
            newExpression += parts[i];
          }
        }
        
        expressionToEvaluate = newExpression;
      }
      
      // Evaluate the expression
      const result = eval(expressionToEvaluate);
      const formattedResult = parseFloat(result.toPrecision(10)).toString();
      
      // Add to history
      setHistory([
        ...history,
        { expression: displayValue, result: formattedResult }
      ]);
      
      setDisplayValue(formattedResult);
      setExpression(formattedResult);
      setPendingOperation(null);
    } catch (error) {
      setDisplayValue('Error');
    }
  };

  // Handle clear button
  const handleClear = () => {
    setDisplayValue('0');
    setExpression('');
    setPendingOperation(null);
  };

  // Handle backspace button
  const handleBackspace = () => {
    if (displayValue === 'Error') {
      setDisplayValue('0');
      setExpression('');
      return;
    }
    
    if (displayValue.length === 1) {
      setDisplayValue('0');
      setExpression('');
    } else {
      setDisplayValue(displayValue.slice(0, -1));
      setExpression(expression.slice(0, -1));
    }
  };

  // Handle percentage button
  const handlePercentage = () => {
    if (displayValue === 'Error') {
      return;
    }
    
    setDisplayValue(displayValue + '%');
    setExpression(expression + '%');
  };

  // Handle negate button
  const handleNegate = () => {
    if (displayValue === 'Error' || displayValue === '0') {
      return;
    }
    
    if (displayValue.startsWith('-')) {
      setDisplayValue(displayValue.substring(1));
      setExpression(expression.substring(1));
    } else {
      setDisplayValue('-' + displayValue);
      setExpression('-' + expression);
    }
  };

  // Handle memory functions
  const handleMemoryStore = () => {
    try {
      const result = eval(expression.replace(/×/g, '*').replace(/÷/g, '/'));
      setMemory(result);
    } catch (error) {
      // Ignore invalid expressions
    }
  };

  const handleMemoryRecall = () => {
    if (memory !== null) {
      if (displayValue === '0' || displayValue === 'Error') {
        setDisplayValue(memory.toString());
        setExpression(memory.toString());
      } else {
        setDisplayValue(displayValue + memory.toString());
        setExpression(expression + memory.toString());
      }
    }
  };

  const handleMemoryClear = () => {
    setMemory(null);
  };

  const handleMemoryAdd = () => {
    try {
      const result = eval(expression.replace(/×/g, '*').replace(/÷/g, '/'));
      setMemory(memory === null ? result : memory + result);
    } catch (error) {
      // Ignore invalid expressions
    }
  };

  const handleMemorySubtract = () => {
    try {
      const result = eval(expression.replace(/×/g, '*').replace(/÷/g, '/'));
      setMemory(memory === null ? -result : memory - result);
    } catch (error) {
      // Ignore invalid expressions
    }
  };

  // Toggle history visibility
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-display font-bold text-center mb-6">Basic Calculator</h1>
        
        <div className="calculator-container max-w-md mx-auto">
          {/* Display */}
          <div className="calculator-display text-2xl mb-1 p-4 bg-gray-50 rounded-lg">
            <span className="text-right block overflow-x-auto">{displayValue}</span>
          </div>
          
          {/* Memory indicator */}
          <div className="flex justify-between text-xs text-gray-500 mb-4">
            {memory !== null && <span>Memory: {memory}</span>}
            <span>{pendingOperation || ''}</span>
          </div>
          
          {/* Calculator buttons */}
          <div className="grid grid-cols-4 gap-2">
            {/* First row */}
            <button 
              onClick={handleMemoryClear} 
              className="calculator-button bg-gray-200 text-gray-800"
            >
              MC
            </button>
            <button 
              onClick={handleMemoryRecall} 
              className="calculator-button bg-gray-200 text-gray-800"
            >
              MR
            </button>
            <button 
              onClick={handleMemoryAdd} 
              className="calculator-button bg-gray-200 text-gray-800"
            >
              M+
            </button>
            <button 
              onClick={handleMemorySubtract} 
              className="calculator-button bg-gray-200 text-gray-800"
            >
              M-
            </button>
            
            {/* Second row */}
            <button 
              onClick={handleClear} 
              className="calculator-button bg-red-100 text-red-700"
            >
              C
            </button>
            <button 
              onClick={handleNegate} 
              className="calculator-button bg-gray-200 text-gray-800"
            >
              +/-
            </button>
            <button 
              onClick={handlePercentage} 
              className="calculator-button bg-gray-200 text-gray-800"
            >
              <Percent size={18} className="inline" />
            </button>
            <button 
              onClick={() => handleOperationInput('÷')} 
              className={`calculator-button ${pendingOperation === '÷' ? 'bg-primary-500 text-white' : 'bg-primary-100 text-primary-700'}`}
            >
              <Divide size={18} className="inline" />
            </button>
            
            {/* Third row */}
            <button 
              onClick={() => handleNumberInput('7')} 
              className="calculator-button bg-white border border-gray-200"
            >
              7
            </button>
            <button 
              onClick={() => handleNumberInput('8')} 
              className="calculator-button bg-white border border-gray-200"
            >
              8
            </button>
            <button 
              onClick={() => handleNumberInput('9')} 
              className="calculator-button bg-white border border-gray-200"
            >
              9
            </button>
            <button 
              onClick={() => handleOperationInput('×')} 
              className={`calculator-button ${pendingOperation === '×' ? 'bg-primary-500 text-white' : 'bg-primary-100 text-primary-700'}`}
            >
              <X size={18} className="inline" />
            </button>
            
            {/* Fourth row */}
            <button 
              onClick={() => handleNumberInput('4')} 
              className="calculator-button bg-white border border-gray-200"
            >
              4
            </button>
            <button 
              onClick={() => handleNumberInput('5')} 
              className="calculator-button bg-white border border-gray-200"
            >
              5
            </button>
            <button 
              onClick={() => handleNumberInput('6')} 
              className="calculator-button bg-white border border-gray-200"
            >
              6
            </button>
            <button 
              onClick={() => handleOperationInput('-')} 
              className={`calculator-button ${pendingOperation === '-' ? 'bg-primary-500 text-white' : 'bg-primary-100 text-primary-700'}`}
            >
              <Minus size={18} className="inline" />
            </button>
            
            {/* Fifth row */}
            <button 
              onClick={() => handleNumberInput('1')} 
              className="calculator-button bg-white border border-gray-200"
            >
              1
            </button>
            <button 
              onClick={() => handleNumberInput('2')} 
              className="calculator-button bg-white border border-gray-200"
            >
              2
            </button>
            <button 
              onClick={() => handleNumberInput('3')} 
              className="calculator-button bg-white border border-gray-200"
            >
              3
            </button>
            <button 
              onClick={() => handleOperationInput('+')} 
              className={`calculator-button ${pendingOperation === '+' ? 'bg-primary-500 text-white' : 'bg-primary-100 text-primary-700'}`}
            >
              <Plus size={18} className="inline" />
            </button>
            
            {/* Sixth row */}
            <button 
              onClick={handleBackspace} 
              className="calculator-button bg-gray-200 text-gray-800 col-span-1"
            >
              <Delete size={18} className="inline" />
            </button>
            <button 
              onClick={() => handleNumberInput('0')} 
              className="calculator-button bg-white border border-gray-200"
            >
              0
            </button>
            <button 
              onClick={handleDecimalInput} 
              className="calculator-button bg-white border border-gray-200"
            >
              .
            </button>
            <button 
              onClick={handleCalculate} 
              className="calculator-button bg-primary-600 text-white font-bold hover:bg-primary-700 shadow-md"
            >
              =
            </button>
          </div>
          
          {/* History toggle button */}
          <div className="mt-4 text-center">
            <button 
              onClick={toggleHistory}
              className="text-primary-600 text-sm flex items-center mx-auto"
            >
              <CornerUpLeft size={14} className="mr-1" />
              {showHistory ? 'Hide' : 'Show'} History
            </button>
          </div>
          
          {/* History section */}
          {showHistory && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-4 border-t pt-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold">Calculation History</h3>
                {history.length > 0 && (
                  <button 
                    onClick={clearHistory}
                    className="text-xs text-red-500"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              <div className="max-h-40 overflow-y-auto">
                {history.length > 0 ? (
                  <ul className="space-y-2">
                    {history.map((item, index) => (
                      <li key={index} className="text-sm">
                        <div className="text-gray-600">{item.expression}</div>
                        <div className="font-medium">{item.result}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No calculation history yet.</p>
                )}
              </div>
            </motion.div>
          )}
        </div>
        
        {/* User Guide Section */}
        <div className="guide-section mt-12 max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Basic Calculator Guide</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Basic Operations</h3>
              <ul className="space-y-1 text-gray-700">
                <li>
                  <span className="inline-block w-32">+, -, ×, ÷</span>
                  <span className="text-gray-500">Basic arithmetic</span>
                </li>
                <li>
                  <span className="inline-block w-32">%</span>
                  <span className="text-gray-500">Percentage calculations</span>
                </li>
                <li>
                  <span className="inline-block w-32">+/-</span>
                  <span className="text-gray-500">Toggle positive/negative</span>
                </li>
                <li>
                  <span className="inline-block w-32">DEL</span>
                  <span className="text-gray-500">Backspace/delete</span>
                </li>
                <li>
                  <span className="inline-block w-32">C</span>
                  <span className="text-gray-500">Clear all</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Memory Functions</h3>
              <ul className="space-y-1 text-gray-700">
                <li>
                  <span className="inline-block w-32">MC</span>
                  <span className="text-gray-500">Memory clear</span>
                </li>
                <li>
                  <span className="inline-block w-32">MR</span>
                  <span className="text-gray-500">Memory recall</span>
                </li>
                <li>
                  <span className="inline-block w-32">M+</span>
                  <span className="text-gray-500">Add to memory</span>
                </li>
                <li>
                  <span className="inline-block w-32">M-</span>
                  <span className="text-gray-500">Subtract from memory</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Tips</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Use the history feature to review your previous calculations</li>
              <li>• You can continue calculations from the previous result</li>
              <li>• The calculator handles order of operations automatically</li>
              <li>• Keyboard input is fully supported</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BasicCalculator;