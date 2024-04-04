import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import HistoricalView from './widgets/historicalView';
import IncomeStatementView from './widgets/incomeStatement';
import BalanceSheetView from './widgets/balanceSheet';
import CashFlowView from './widgets/cashFlow';
import Loading from './effects/Loading';

const TickerOverview = () => {
  const { symbol } = useParams();
  const [companyName, setCompanyName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setCompanyName(null); // Reset company name when symbol changes
    setIsLoading(true); // Set loading state to true when fetching data
    setProgress(0); // Reset progress to 0 when fetching new data

    const fetchCompanyName = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/company-name/${symbol}`);
        const data = await response.json();
        if (data.companyName) {
          setCompanyName(data.companyName.replace(/\s*\([^)]*\)\s*/, ''));
        } else {
          console.error('Error fetching company name:', data.error);
          setCompanyName('Error');
        }
      } catch (error) {
        console.error('Error fetching company name:', error);
        setCompanyName('Error');
      } finally {
        setIsLoading(false); // Set loading state to false once data is fetched
      }
    };

    fetchCompanyName();
  }, [symbol]);

  useEffect(() => {
    if (!companyName) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(timer);
            return 0;
          }
          return prevProgress + 5; // Increase progress by 5% every second
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [companyName]);

  return (
    <div>
      <h1 className='pb-5' style={{ textAlign: 'left', fontWeight: 'normal', fontSize: '24px' }}>
        {companyName ? (
          <span>
            <strong>{companyName}</strong> (<span>{symbol.toUpperCase()}</span>)
          </span>
        ) : (
          <span>
            [Loading...] (<span>{symbol.toUpperCase()}</span>)
          </span>
        )}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-100 p-4 shadow rounded-lg col-span-1 row-span-1">
          <HistoricalView symbol={symbol} />
        </div>
        <div className="bg-gray-100 p-4 shadow rounded-lg col-span-1 row-span-1">
          <IncomeStatementView symbol={symbol} />
        </div>
        <div className="bg-gray-100 p-4 shadow rounded-lg col-span-1 row-span-1">
          <BalanceSheetView symbol={symbol} />
        </div>
        <div className="bg-gray-100 p-4 shadow rounded-lg col-span-1 row-span-1">
          <CashFlowView symbol={symbol} />
        </div>
      </div>
      {isLoading && <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)' // Semi-transparent overlay for loading
      }}>
        <Loading progress={progress} />
      </div>}
    </div>
  );
};

export default TickerOverview;
