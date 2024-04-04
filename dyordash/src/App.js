import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './components/Dashboard';
import IncomeStatement from './components/IncomeStatement';
import Layout from "./components/shared/Layout";
import CashFlow from "./components/CashFlow";
import BalanceSheet from "./components/BalanceSheet";
import AiAnalysis from "./components/AiAnalysis";
import { TickerProvider } from './components/routing/TickerContext'; // Ensure this is correctly imported
import ProtectedRoute from './components/routing/ProtectedRoute'; // Adjust the import path as necessary
import TickerOverview from "./components/TickerOverview"

function App() {
  return (
    <TickerProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path='incomestatement/:symbol' element={<ProtectedRoute><IncomeStatement /></ProtectedRoute>} />
            <Route path='cashflow/:symbol' element={<ProtectedRoute><CashFlow /></ProtectedRoute>} />
            <Route path='balancesheet/:symbol' element={<ProtectedRoute><BalanceSheet /></ProtectedRoute>} />
            <Route path='aianalysis/:symbol' element={<ProtectedRoute><AiAnalysis /></ProtectedRoute>} />
            <Route path='ticker-overview/:symbol' element={<ProtectedRoute><TickerOverview /></ProtectedRoute>} />
            <Route path='incomestatement' element={<ProtectedRoute><IncomeStatement /></ProtectedRoute>} />
            <Route path='cashflow' element={<ProtectedRoute><CashFlow /></ProtectedRoute>} />
            <Route path='balancesheet' element={<ProtectedRoute><BalanceSheet /></ProtectedRoute>} />
            <Route path='aianalysis' element={<ProtectedRoute><AiAnalysis /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </TickerProvider>
  );
}

export default App;