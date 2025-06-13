# Allin1Calculator

A modern, responsive, and feature-rich web calculator application built with React, Vite, and Tailwind CSS.

![Allin1Calculator](public/calculator-icon.svg)

## 🚀 Features

Allin1Calculator offers a comprehensive suite of calculators and converters:

- **Basic Calculator**: Perform simple arithmetic operations with memory functions
- **Scientific Calculator**: Advanced mathematical functions including trigonometry, logarithms, and more
- **Financial Calculators**:
  - Loan EMI Calculator: Calculate monthly payments, total interest, and view amortization schedules
  - SIP Calculator: Project your investment growth with visualizations
  - Tax Calculator: Estimate taxes with a progressive tax bracket breakdown
- **Conversion Tools**:
  - Length Converter: Convert between various length units (meters, feet, inches, etc.)
  - Weight Converter
  - Temperature Converter
  - Currency Converter
- **BMI Calculator**: Calculate and track your Body Mass Index

## ✨ Technologies

- **React**: Frontend library for building user interfaces
- **Vite**: Next-generation frontend build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for React
- **Chart.js**: Data visualization with React-chartjs-2
- **Lucide React**: Beautiful, consistent icons
- **Math.js**: Advanced math library for scientific calculations
- **React Router DOM**: Client-side routing

## 🛠️ Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/allin1calculator.git
   cd allin1calculator
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
allin1calculator/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable components
│   │   ├── layout/       # Layout components (Navbar, Footer)
│   │   └── ui/           # UI components (buttons, inputs, etc.)
│   ├── pages/            # Application pages
│   │   ├── converters/   # Converter tools
│   │   └── financial/    # Financial calculators
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles and Tailwind directives
├── index.html            # HTML template
└── ...config files
```

## 📱 Features

- **Responsive Design**: Works on all devices (mobile, tablet, desktop)
- **Keyboard Support**: Use your keyboard for faster calculations
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Data Visualization**: Interactive charts for financial calculations
- **History Tracking**: Keep track of your calculations and conversions
- **Comprehensive Guides**: Each calculator includes a user guide

## 🔜 Future Enhancements

- User accounts for saving calculation history
- Dark mode support
- Additional calculators (mortgage, retirement, etc.)
- PWA support for offline use

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Chart.js](https://www.chartjs.org/)
- [Lucide Icons](https://lucide.dev/)