import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { useCurrencyRatesStore } from './lib/currency-rates-store'
import { useEffect } from 'react'
import LoadingSpinner from './components/ui/LoadingSpinner'


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <InitApp />
  </BrowserRouter>
)


function InitApp() {
  const { rates, date, loading, updateRates } = useCurrencyRatesStore();

  useEffect(() => {
    updateRates()
  }, [])

  return (
    <>
      {loading ? <LoadingSpinner /> : (
        <App />
      )}
    </>
  )

}