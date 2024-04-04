import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Line, Pie } from 'react-chartjs-2';
import NoBalanceSheet from './effects/noBalanceSheet';
import BalanceSheetSummaryWidget from './widgets/BalanceSheetAI';

const formatDate = (dateString) => {
  const [year, month, day] = dateString.split('T')[0].split('-');
  return `${day}-${month}-${year}`;
};

const formatNumber = (num) => {
    if (num === null || num === undefined || isNaN(num)) {
      return 'N/A';  // or some other placeholder text
    }
  
    const absNum = Math.abs(num);
    if (absNum >= 1e9) {
      return `${(num / 1e9).toFixed(1)}B`;
    } else if (absNum >= 1e6) {
      return `${(num / 1e6).toFixed(1)}M`;
    } else if (absNum >= 1e3) {
      return `${(num / 1e3).toFixed(1)}K`;
    } else {
      return num.toFixed(2);
    }
  };

const BalanceSheetPage = () => {
  const { symbol } = useParams();
  const [balanceSheetData, setBalanceSheetData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyName, setCompanyName] = useState('Loading...');
  const [activeTab, setActiveTab] = useState('lineChart');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const tabStyle = (isActive) =>
  `w-full text-center p-4 border-b-2 cursor-pointer ${
    isActive ? 'border-neutral-700 text-neutral-800 font-semibold' : 'border-transparent'
  }`;
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const responseName = await fetch(`http://127.0.0.1:8000/company-name/${symbol}`);
        const nameData = await responseName.json();
        setCompanyName(nameData.companyName ? nameData.companyName.replace(/\s*\([^)]*\)\s*/, '') : 'Error fetching company name');

        const response = await fetch(`http://127.0.0.1:8000/balance-sheet-page/${symbol}`);
        const data = await response.json();

        if (response.ok && Object.keys(data).length) {
          setBalanceSheetData(data);
        } else {
          throw new Error('Failed to load data');
        }
      } catch (error) {
        setError('This ticker has no balance sheet data available.');
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <NoBalanceSheet
        title="Error"
        message={error}
      />
    );
  }

  const years = Object.keys(balanceSheetData).sort();
  const formattedYears = years.map(year => formatDate(year));
  const totalAssets = years.map(year => parseFloat(balanceSheetData[year]['Total Assets']));
  const totalLiabilities = years.map(year => parseFloat(balanceSheetData[year]['Total Liabilities Net Minority Interest']));
  const totalEquity = years.map(year => parseFloat(balanceSheetData[year]['Stockholders Equity']));

  const lineChartData = {
    labels: formattedYears,
    datasets: [
      {
        label: 'Total Assets',
        data: totalAssets,
        borderColor: 'rgba(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Total Liabilities',
        data: totalLiabilities,
        borderColor: 'rgba(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Total Equity',
        data: totalEquity,
        borderColor: 'rgba(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Total Assets, Liabilities, and Equity Over Time',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += formatNumber(context.parsed.y);
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatNumber(value),
        }
      }
    }
  };
  

  // Latest year data for pie charts
  const latestYear = years[years.length - 1];
  const currentAssets = parseFloat(balanceSheetData[latestYear]['Current Assets']);
  const nonCurrentAssets = parseFloat(balanceSheetData[latestYear]['Total Non Current Assets']);
  const currentLiabilities = parseFloat(balanceSheetData[latestYear]['Current Liabilities']);
  const nonCurrentLiabilities = parseFloat(balanceSheetData[latestYear]['Total Non Current Liabilities Net Minority Interest']);

  // Chart data for assets composition
  const assetsPieChartData = {
    labels: ['Current Assets', 'Non-Current Assets'],
    datasets: [
      {
        label: 'Assets Composition',
        data: [currentAssets, nonCurrentAssets],
        backgroundColor: ['rgba(255, 205, 86)', 'rgba(255, 99, 132)'],
      }
    ]
  };

  // Chart data for liabilities composition
  const liabilitiesPieChartData = {
    labels: ['Current Liabilities', 'Non-Current Liabilities'],
    datasets: [
      {
        label: 'Liabilities Composition',
        data: [currentLiabilities, nonCurrentLiabilities],
        backgroundColor: ['rgba(54, 162, 235)', 'rgba(75, 192, 192)'],
      }
    ]
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            label += formatNumber(context.parsed);
            return label;
          }
        }
      },
      title: {
        display: false,
        text: 'Composition of Assets and Liabilities',
      }
    }
  };
  

  // Using a responsive grid layout
return (
    <div className="mt-10">
      <div className="bg-gray-100 p-5 shadow-lg rounded-lg">
        {/* Summary Boxes for Company Name, Symbol, and Key Figures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Box for Company Name and Symbol */}
          <div className="bg-white p-4 shadow rounded-lg">
            <h2><span className="text-xl font-bold">{companyName}</span> | {symbol.toUpperCase()}</h2>
          </div>
          {/* Box for Key Figures */}
          <div className="bg-white p-4 shadow rounded-lg text-right text-sm">
            <p className="font-bold">Year: {latestYear ? new Date(latestYear).getFullYear() : 'Not Available'}</p>
            <p>Total Assets: {formatNumber(totalAssets[totalAssets.length - 1])}</p>
            <p>Total Liabilities: {formatNumber(totalLiabilities[totalLiabilities.length - 1])}</p>
            <p>Stockholders Equity: {formatNumber(totalEquity[totalEquity.length - 1])}</p>
          </div>
        </div>
    {/* Tabs container */}
    <div className="flex flex-wrap -mx-4 mb-8">
          <div className="w-full lg:w-1/2 px-4 mb-4 lg:mb-0">
            <div
              className={tabStyle(activeTab === 'lineChart')}
              onClick={() => setActiveTab('lineChart')}
            >
              Financial Overview
            </div>
          </div>
          <div className="w-full lg:w-1/2 px-4">
            <div
              className={tabStyle(activeTab === 'pieCharts')}
              onClick={() => setActiveTab('pieCharts')}
            >
              Composition Charts
            </div>
          </div>
        </div>

        {/* Conditional rendering of charts based on activeTab */}
        {activeTab === 'lineChart' ? (
          // Line chart container
          <div className="bg-white p-5 shadow-lg rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Assets, Liabilities, and Equity Over Time</h3>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        ) : (
          // Pie charts container
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assets pie chart */}
            <div className="bg-white p-5 shadow-lg rounded-lg">
              <h3 className="text-lg font-semibold">Assets Composition</h3>
              <Pie data={assetsPieChartData} options={pieChartOptions} />
            </div>
            {/* Liabilities pie chart */}
            <div className="bg-white p-5 shadow-lg rounded-lg">
              <h3 className="text-lg font-semibold">Liabilities Composition</h3>
              <Pie data={liabilitiesPieChartData} options={pieChartOptions} />
            </div>
          </div>
        )}
        {/* Balance Sheet Summary Widget */}
      <div className="w-full px-4 mt-8">
        <div className="bg-white p-5 shadow-lg rounded-lg">
          <h3 className="text-lg font-semibold text-center">Balance Sheet Overview and Strategic Analysis</h3>
          <div className="flex justify-center">
            <BalanceSheetSummaryWidget symbol={symbol} />
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default BalanceSheetPage;