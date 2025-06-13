import React, { useState, useRef, useEffect } from "react";
import { create, all } from "mathjs";
import "../index.css";
// Math.js configuration
const config = {
  number: "BigNumber", // Use BigNumber for precision
  precision: 64, // Set precision for BigNumber
  randomSeed: null, // No random seed
  predictable: false // Allow non-predictable results
};

// Helper: preprocess trig/log functions for degree mode, supports nested parentheses
function preprocessExpression(expr, degreeMode) {
  if (!degreeMode) return expr;
  // Convert all trig functions (sin, cos, tan, sec, cosec, cot) to radians
  return expr
    .replace(
      /\b(sin|cos|tan|sec|cosec|cot)\s*\(((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*)\)/g,
      (match, fn, arg) => {
        if (["sin", "cos", "tan"].includes(fn)) {
          return `${fn}(((${arg}) * pi / 180))`;
        } else if (fn === "sec") {
          return `sec(((${arg}) * pi / 180))`;
        } else if (fn === "cosec") {
          return `cosec(((${arg}) * pi / 180))`;
        } else if (fn === "cot") {
          return `cot(((${arg}) * pi / 180))`;
        }
        return match;
      }
    );
}

// Math.js instance
const math = create(all, config);

// Define sec, cosec, cot only if not already defined
if (!math.hasOwnProperty("sec")) {
  math.import({
    sec: function (x) {
      return 1 / math.cos(x);
    }
  }, { override: false });
}
if (!math.hasOwnProperty("cosec")) {
  math.import({
    cosec: function (x) {
      return 1 / math.sin(x);
    }
  }, { override: false });
}
if (!math.hasOwnProperty("cot")) {
  math.import({
    cot: function (x) {
      return 1 / math.tan(x);
    }
  }, { override: false });
}

const BUTTONS = [
  [
    { label: "DEG", type: "toggleDeg", className: "bg-gray-200" },
    { label: "(", type: "bracket", value: "(", className: "bg-gray-200" },
    { label: ")", type: "bracket", value: ")", className: "bg-gray-200" },
    { label: "MC", type: "memory", value: "clear", className: "bg-gray-200" },
    { label: "MR", type: "memory", value: "recall", className: "bg-gray-200" },
    { label: "M+", type: "memory", value: "add", className: "bg-gray-200" }
  ],
  [
    { label: "sin", type: "func", value: "sin" },
    { label: "cos", type: "func", value: "cos" },
    { label: "tan", type: "func", value: "tan" },
    { label: "√", type: "func", value: "sqrt" },
    { label: "x²", type: "func", value: "square" },
    { label: "÷", type: "operator", value: "/" }
  ],
  [
    { label: "ln", type: "log", value: "ln" },
    { label: "log", type: "log", value: "log" },
    { label: "e", type: "const", value: "e" },
    { label: "π", type: "const", value: "pi" },
    { label: "%", type: "operator", value: "%" },
    { label: "×", type: "operator", value: "*" }
  ],
  [
    { label: "7", type: "number" },
    { label: "8", type: "number" },
    { label: "9", type: "number" },
    { label: "-", type: "operator", value: "-" },
    { label: "C", type: "clear", className: "bg-red-100 text-red-700" },
    { label: "⌫", type: "backspace", className: "bg-gray-200" }
  ],
  [
    { label: "4", type: "number" },
    { label: "5", type: "number" },
    { label: "6", type: "number" },
    { label: "+", type: "operator", value: "+" },
    { label: "^", type: "operator", value: "^" },
    { label: "=", type: "equals", className: "bg-primary-600 text-white col-span-1 row-span-2" }
  ],
  [
    { label: "1", type: "number" },
    { label: "2", type: "number" },
    { label: "3", type: "number" },
    { label: "0", type: "number", className: "col-span-2" },
    { label: ".", type: "decimal" }
  ]
];

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [degreeMode, setDegreeMode] = useState(true);
  const [memory, setMemory] = useState(null);

  // Helper to get last number in the expression for decimal logic
  const getLastNumber = () => {
    const match = expression.match(/([0-9.]+)$/);
    return match ? match[1] : "";
  };

  const append = (val) => {
    if (display === "0" || display === "Error") {
      setDisplay(val);
      setExpression(val);
    } else {
      setDisplay(display + val);
      setExpression(expression + val);
    }
  };

  const handleButton = (btn) => {
    if (display === "Error" && btn.type !== "clear") return;

    switch (btn.type) {
      case "number":
        // Prevent leading zeros
        if (display === "0") {
          setDisplay(btn.label);
          setExpression(btn.label);
        } else {
          setDisplay(display + btn.label);
          setExpression(expression + btn.label);
        }
        break;
      case "operator":
        // Prevent two operators in a row (except minus for negative numbers)
        if (
          /[+\-*/^%]$/.test(expression) &&
          !(btn.value === "-" && !/[+\-*/^%]-$/.test(expression))
        ) {
          setDisplay(display.slice(0, -1) + btn.label);
          setExpression(expression.slice(0, -1) + btn.value);
        } else {
          setDisplay(display + btn.label);
          setExpression(expression + btn.value);
        }
        break;
      case "func":
        if (btn.value === "square") {
          setDisplay(display + "²");
          setExpression(expression + "^2");
        } else if (btn.value === "sqrt") {
          setDisplay(display + "√(");
          setExpression(expression + "sqrt(");
        } else if (["sin", "cos", "tan", "asin", "acos", "atan", "sinh", "cosh", "tanh", "asinh", "acosh", "atanh"].includes(btn.value)) {
          setDisplay(display + btn.label + "(");
          setExpression(expression + btn.value + "(");
        } else {
          setDisplay(display + btn.label + "(");
          setExpression(expression + btn.value + "(");
        }
        break;
      case "log":
        if (btn.value === "ln") {
          setDisplay(display + "ln(");
          setExpression(expression + "log("); // mathjs uses log(x) for natural log
        } else {
          setDisplay(display + "log(");
          setExpression(expression + "log10("); // mathjs uses log10(x) for base-10 log
        }
        break;
      case "const":
        if (btn.value === "pi") {
          setDisplay(display + "π");
          setExpression(expression + "pi");
        } else if (btn.value === "e") {
          setDisplay(display + "e");
          setExpression(expression + "e");
        }
        break;
      case "bracket":
        setDisplay(display + btn.value);
        setExpression(expression + btn.value);
        break;
      case "clear":
        setDisplay("0");
        setExpression("");
        break;
      case "backspace":
        setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
        setExpression(expression.length > 1 ? expression.slice(0, -1) : "");
        break;
      case "toggleDeg":
        setDegreeMode((d) => !d);
        break;
      case "memory":
        if (btn.value === "clear") setMemory(null);
        if (btn.value === "recall" && memory !== null) {
          setDisplay(display === "0" ? memory.toString() : display + memory.toString());
          setExpression(expression === "" ? memory.toString() : expression + memory.toString());
        }
        if (btn.value === "add" && display !== "Error") {
          try {
            const val = parseFloat(display);
            if (!isNaN(val)) setMemory((m) => (m === null ? val : m + val));
          } catch {}
        }
        break;
      case "equals":
        try {
          let expr = expression
            .replace(/π/g, "pi")
            .replace(/÷/g, "/")
            .replace(/×/g, "*")
            // Replace percentages (e.g., 50%) with (50/100)
            .replace(/([0-9.]+)%/g, "($1/100)");
          expr = preprocessExpression(expr, degreeMode);
          let result = math.evaluate(expr);

          // Fix: Round result to 12 decimal places if it's a number
          let displayResult;
          if (typeof result === "number" || (result && typeof result.toNumber === "function")) {
            const num = typeof result === "number" ? result : result.toNumber();
            // If the result is very close to an integer, show as integer
            if (Math.abs(num - Math.round(num)) < 1e-12) {
              displayResult = Math.round(num).toString();
            } else {
              displayResult = Number(num.toFixed(12)).toString();
            }
          } else {
            displayResult = result.toString();
          }

          setDisplay(displayResult);
          setExpression(displayResult);
        } catch {
          setDisplay("Error");
          setExpression("");
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded shadow">
      <div className="mb-4 text-right text-2xl font-mono min-h-[2.5rem] break-all">{display}</div>
      <div className="grid grid-cols-6 gap-2">
        {BUTTONS.flat().map((btn, i) =>
          btn ? (
            <button
              key={i}
              className={`calculator-button py-2 rounded ${btn.className || "bg-white border border-gray-200"} ${btn.label === (degreeMode ? "DEG" : "RAD") ? "bg-primary-100 text-primary-700" : ""}`}
              style={{
                gridColumn: btn.className && btn.className.includes("col-span-2") ? "span 2 / span 2" : undefined,
                gridRow: btn.className && btn.className.includes("row-span-2") ? "span 2 / span 2" : undefined
              }}
              onClick={() => handleButton(btn)}
            >
              {btn.label === "DEG" ? (degreeMode ? "DEG" : "RAD") : btn.label}
            </button>
          ) : null
        )}
      </div>
    </div>
  );
}