import React, { useState } from 'react';

/**
 * Calculator component that implements a simple calculator
 * This will replace the iframe-based Calculator program
 */
const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [memory, setMemory] = useState(0);
  
  // Handle digit input
  const inputDigit = (digit) => {
    if (waitingForSecondOperand) {
      setDisplay(String(digit));
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };
  
  // Handle decimal point
  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };
  
  // Handle operators
  const handleOperator = (nextOperator) => {
    const inputValue = parseFloat(display);
    
    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation();
      setDisplay(String(result));
      setFirstOperand(result);
    }
    
    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };
  
  // Perform calculation
  const performCalculation = () => {
    const inputValue = parseFloat(display);
    
    if (operator === '+') {
      return firstOperand + inputValue;
    } else if (operator === '-') {
      return firstOperand - inputValue;
    } else if (operator === '*') {
      return firstOperand * inputValue;
    } else if (operator === '/') {
      return firstOperand / inputValue;
    }
    
    return inputValue;
  };
  
  // Handle equals
  const handleEquals = () => {
    if (!operator) return;
    
    const inputValue = parseFloat(display);
    const result = performCalculation();
    
    setDisplay(String(result));
    setFirstOperand(result);
    setOperator(null);
    setWaitingForSecondOperand(true);
  };
  
  // Clear display
  const clearDisplay = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };
  
  // Toggle sign
  const toggleSign = () => {
    setDisplay(String(-parseFloat(display)));
  };
  
  // Handle percentage
  const handlePercentage = () => {
    const inputValue = parseFloat(display);
    setDisplay(String(inputValue / 100));
  };
  
  // Memory functions
  const memoryAdd = () => {
    setMemory(memory + parseFloat(display));
  };
  
  const memorySubtract = () => {
    setMemory(memory - parseFloat(display));
  };
  
  const memoryRecall = () => {
    setDisplay(String(memory));
  };
  
  const memoryClear = () => {
    setMemory(0);
  };
  
  // Button style
  const buttonStyle = {
    width: '40px',
    height: '30px',
    margin: '2px',
    backgroundColor: '#c0c0c0',
    border: '1px solid #808080',
    borderRadius: '0',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer'
  };
  
  // Display style
  const displayStyle = {
    width: '100%',
    height: '40px',
    marginBottom: '10px',
    padding: '5px',
    backgroundColor: '#e0e0e0',
    border: '1px solid #808080',
    textAlign: 'right',
    fontSize: '20px',
    fontFamily: 'monospace'
  };
  
  return (
    <div className="calculator-container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      padding: '10px',
      backgroundColor: '#c0c0c0'
    }}>
      {/* Display */}
      <div style={displayStyle}>{display}</div>
      
      {/* Memory buttons */}
      <div style={{ display: 'flex', marginBottom: '5px' }}>
        <button style={buttonStyle} onClick={memoryClear}>MC</button>
        <button style={buttonStyle} onClick={memoryRecall}>MR</button>
        <button style={buttonStyle} onClick={memoryAdd}>M+</button>
        <button style={buttonStyle} onClick={memorySubtract}>M-</button>
      </div>
      
      {/* Calculator buttons */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex' }}>
          <button style={buttonStyle} onClick={clearDisplay}>C</button>
          <button style={buttonStyle} onClick={toggleSign}>±</button>
          <button style={buttonStyle} onClick={handlePercentage}>%</button>
          <button style={buttonStyle} onClick={() => handleOperator('/')}>/</button>
        </div>
        <div style={{ display: 'flex' }}>
          <button style={buttonStyle} onClick={() => inputDigit(7)}>7</button>
          <button style={buttonStyle} onClick={() => inputDigit(8)}>8</button>
          <button style={buttonStyle} onClick={() => inputDigit(9)}>9</button>
          <button style={buttonStyle} onClick={() => handleOperator('*')}>*</button>
        </div>
        <div style={{ display: 'flex' }}>
          <button style={buttonStyle} onClick={() => inputDigit(4)}>4</button>
          <button style={buttonStyle} onClick={() => inputDigit(5)}>5</button>
          <button style={buttonStyle} onClick={() => inputDigit(6)}>6</button>
          <button style={buttonStyle} onClick={() => handleOperator('-')}>-</button>
        </div>
        <div style={{ display: 'flex' }}>
          <button style={buttonStyle} onClick={() => inputDigit(1)}>1</button>
          <button style={buttonStyle} onClick={() => inputDigit(2)}>2</button>
          <button style={buttonStyle} onClick={() => inputDigit(3)}>3</button>
          <button style={buttonStyle} onClick={() => handleOperator('+')}>+</button>
        </div>
        <div style={{ display: 'flex' }}>
          <button style={{ ...buttonStyle, width: '84px' }} onClick={() => inputDigit(0)}>0</button>
          <button style={buttonStyle} onClick={inputDecimal}>.</button>
          <button style={buttonStyle} onClick={handleEquals}>=</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
