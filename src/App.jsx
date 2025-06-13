import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import Layout from './layouts/Layout';

// Pages (lazy loaded)
const Home = lazy(() => import('./pages/Home'));
const BasicCalculator = lazy(() => import('./pages/BasicCalculator'));
const ScientificCalculator = lazy(() => import('./pages/ScientificCalculator'));
const LoanCalculator = lazy(() => import('./pages/financial/LoanCalculator'));
const SipCalculator = lazy(() => import('./pages/financial/SipCalculator'));
const TaxCalculator = lazy(() => import('./pages/financial/TaxCalculator'));
const LengthConverter = lazy(() => import('./pages/converters/LengthConverter'));
const WeightConverter = lazy(() => import('./pages/converters/WeightConverter'));
const TemperatureConverter = lazy(() => import('./pages/converters/TemperatureConverter'));
const CurrencyConverter = lazy(() => import('./pages/converters/CurrencyConverter'));
const BmiCalculator = lazy(() => import('./pages/BmiCalculator'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component
import LoadingSpinner from './components/ui/LoadingSpinner';

function App() {
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="basic" element={<BasicCalculator />} />
            <Route path="scientific" element={<ScientificCalculator />} />
            <Route path="loan" element={<LoanCalculator />} />
            <Route path="sip" element={<SipCalculator />} />
            <Route path="tax" element={<TaxCalculator />} />
            <Route path="length" element={<LengthConverter />} />
            <Route path="weight" element={<WeightConverter />} />
            <Route path="temperature" element={<TemperatureConverter />} />
            <Route path="currency" element={<CurrencyConverter />} />
            <Route path="bmi" element={<BmiCalculator />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default App;