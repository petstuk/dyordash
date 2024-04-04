import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Bar, Pie, Line } from 'react-chartjs-2';
import NoIncomeStatement from './effects/noIncomeStatement';
import IncomeStatementTable from './widgets/IncomeStatementTable';
import IncomeStatementSummaryWidget from './widgets/IncomeStatementAI'; // Adjust the path as necessary


const formatNumber = (num) => {
  const absNum = Math.abs(num);
  // Only format as billions if the absolute value is 1 billion or more
  if (absNum >= 1e9) {
    return `${(num / 1e9).toFixed(1)}B`;
  } 
  // Format as millions if the number is less than 1 billion but at least 1 million
  else if (absNum >= 1e6) {
    return `${(num / 1e6).toFixed(1)}M`;
  } 
  // Format as thousands if the number is less than 1 million but at least 1 thousand
  else if (absNum >= 1e3) {
    return `${(num / 1e3).toFixed(1)}K`;
  } 
  // If the number is less than 1 thousand, just show the number with two decimal places
  else {
    return num.toFixed(2);
  }
};

const determineUnit = (maxValue) => {
  const absoluteValue = Math.abs(maxValue);
  if (absoluteValue >= 1e9) {
    return { unitStr: ' (in Billions)', divisor: 1e9 };
  } else if (absoluteValue >= 1e6) {
    return { unitStr: ' (in Millions)', divisor: 1e6 };
  } else if (absoluteValue >= 1e3) {
    return { unitStr: ' (in Thousands)', divisor: 1e3 };
  } else {
    return { unitStr: '', divisor: 1 };
  }
};

const IncStatePage = () => {
  const { symbol } = useParams();
  const [incomeStatementData, setIncomeStatementData] = useState(null);
  const [chartData, setChartData] = useState({});
  const [chartData2, setChartData2] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyName, setCompanyName] = useState('Loading...');
  const [unitStr, setUnitStr] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false); // State to control the visibility of the error modal

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
  
      try {
        const responseName = await fetch(`http://127.0.0.1:8000/company-name/${symbol}`);
        const nameData = await responseName.json();
        setCompanyName(nameData.companyName ? nameData.companyName.replace(/\s*\([^)]*\)\s*/, '') : 'Error fetching company name');
  
        const response = await fetch(`http://127.0.0.1:8000/income-statement-page/${symbol}`);
        const data = await response.json();
  
        if (response.ok && Object.keys(data).length) {
          const yearsSortedAsc = Object.keys(data).sort((a, b) => new Date(a) - new Date(b));
          const latestYear = yearsSortedAsc[yearsSortedAsc.length - 1];
          const latestData = data[latestYear];
          const operatingIncomes = yearsSortedAsc.map(year => parseFloat(data[year]['Operating Income']));
  
          const revenues = yearsSortedAsc.map(year => parseFloat(data[year]['Total Revenue']));
          const netIncomes = yearsSortedAsc.map(year => parseFloat(data[year]['Net Income']));
          const maxValue = Math.max(...revenues, ...netIncomes);
          const { unitStr, divisor } = determineUnit(maxValue);
  
          setUnitStr(unitStr); // Update state for dynamic unit string display
  
          // Fetch cost data
          const costData = [
            parseFloat(latestData['Research And Development']),
            parseFloat(latestData['Selling General And Administration']),
            parseFloat(latestData['Other Operating Expenses'])
          ];
  
          setChartData({
            trendData: {
              labels: yearsSortedAsc.map(dateStr => {
                const date = new Date(dateStr);
                return `${('0' + date.getDate()).slice(-2)}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;
              }),
              datasets: [
                {
                  label: 'Total Revenue',
                  data: revenues.map(val => val / divisor),
                  backgroundColor: 'rgba(230, 176, 170)',
                },
                {
                  label: 'Net Income',
                  data: netIncomes.map(val => val / divisor),
                  backgroundColor: 'rgba(150, 111, 214)',
                },
              ],
            },
            costData: {
              labels: ['Research And Development', 'Selling General And Administration', 'Other Operating Expenses'],
              datasets: [
                {
                  label: 'Cost Distribution',
                  data: costData.map(val => val / divisor),
                  backgroundColor: [
                    'rgba(150, 111, 214)',
                    'rgba(230, 176, 170)',
                    'rgba(75, 192, 192)'
                  ]
                },
              ],
            }
          });

          setChartData2({
            labels: yearsSortedAsc.map(dateStr => {
              const date = new Date(dateStr);
              return `${('0' + date.getDate()).slice(-2)}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;
            }),
            datasets: [
              {
                label: 'Operating Income',
                data: operatingIncomes.map(val => val / divisor),
                borderColor: 'rgba(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192)',
                fill: false,
                tension: 0.1
              }
            ]
          });
          
  
          // Set income statement data including the year
          setIncomeStatementData({
            ...latestData,
            year: latestYear // Now setting the year here correctly
          });
        } else {
          throw new Error('Failed to load data');
        }
      } catch (error) {
        setError('This ticker has no income statement data available.');
        setShowErrorModal(true); // Show the error modal when data fetching fails
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [symbol]);

  const handleCloseErrorModal = () => {
    setShowErrorModal(false); // Close the error modal
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Check if an error occurred and render the error modal
  if (error) {
    return (
      <NoIncomeStatement
        isOpen={showErrorModal}
        title="Error"
        message={error}
        onClose={handleCloseErrorModal}
        symbol={symbol}
      />
    );
  }

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `${unitStr}`,
        align: 'end',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
        },
        ticks: {
          maxTicksLimit: 5, // Maximum number of ticks to display on the y-axis
        },
      },
      x: {
        title: {
          display: true,
        },
      },
    }
  };  

// Dynamically set barChartOptions after data is fetched to include dynamic unitStr
const barChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      // Ensure dynamic title reflects the correct unit, including scenarios with negative values
      text: `${unitStr}`, // Uses unitStr determined from determineUnit function
      align: 'end',
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += formatNumber(context.parsed.y * (unitStr.includes('Billions') ? 1e9 : unitStr.includes('Millions') ? 1e6 : unitStr.includes('Thousands') ? 1e3 : 1));
          }
          return label;
        }
      }
    }
  },
  scales: {
    y: {
      ticks: {
        callback: (value) => formatNumber(value * (unitStr.includes('Billions') ? 1e9 : unitStr.includes('Millions') ? 1e6 : unitStr.includes('Thousands') ? 1e3 : 1)),
      }
    }
  }
};

// pieChartOptions defined outside the component remains unchanged
const pieChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: `${unitStr}`, // Dynamic title based on unit
      align: 'end',
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.label || '';
          if (label) {
            label += ': ';
          }
          const value = context.dataset.data[context.dataIndex];
          label += formatNumber(value * (unitStr.includes('Billions') ? 1e9 : unitStr.includes('Millions') ? 1e6 : unitStr.includes('Thousands') ? 1e3 : 1));
          return label;
        }
      }
    }
  }
};

return (
  <div className="mt-10">
    <div className="bg-gray-100 p-5 shadow-lg rounded-lg">
      {/* Flex container for company info and financial details */}
      <div className="flex flex-col md:flex-row flex-wrap -mx-4 mb-8 items-stretch">
        {/* Box for Company Name and Symbol (flexible width, stretch to match height) */}
        <div className="w-full md:w-1/2 px-4 mb-4 md:mb-0">
          <div className="bg-white p-4 shadow rounded-lg h-full flex flex-col justify-between">
            <h2><span className="text-xl font-bold">{companyName}</span> | {symbol.toUpperCase()}</h2>
          </div>
        </div>

        {/* Box for Date, Revenue, EPS, and Net Income (flexible width, stretch to match height) */}
        <div className="w-full md:w-1/2 px-4">
          <div className="bg-white p-4 shadow rounded-lg h-full flex flex-col justify-between text-sm text-right">
            <div>
              <p className="font-bold">Year: {incomeStatementData && incomeStatementData.year ? new Date(incomeStatementData.year).getFullYear() : 'Not Available'}</p>
              <p>Total Revenue: {incomeStatementData && !isNaN(parseFloat(incomeStatementData['Total Revenue'])) ? formatNumber(parseFloat(incomeStatementData['Total Revenue'])) : 'Not Available'}</p>
              <p>Diluted EPS: {incomeStatementData && !isNaN(parseFloat(incomeStatementData['Diluted EPS'])) ? formatNumber(parseFloat(incomeStatementData['Diluted EPS'])) : 'Not Available'}</p>
              <p>Net Income: {incomeStatementData && !isNaN(parseFloat(incomeStatementData['Net Income'])) ? formatNumber(parseFloat(incomeStatementData['Net Income'])) : 'Not Available'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main container for charts */}
      <div className="flex flex-wrap -mx-4">
        {/* Container for the Bar and Line charts */}
        <div className="w-full lg:w-1/2 px-4">
          {/* Box for Revenue and Net Income Trend */}
          <div className="bg-white p-5 shadow-lg rounded-lg mb-4">
            <h3 className="text-lg font-semibold mb-2">Revenue and Net Income Trend</h3>
            <Bar data={chartData.trendData} options={barChartOptions} />
          </div>
          
          {/* Box for Operating Income Trend */}
          <div className="bg-white p-5 shadow-lg rounded-lg">
            <h3 className="text-lg font-semibold">Operating Income</h3>
            <Line data={chartData2} options={lineChartOptions} />
          </div>
        </div>

        {/* Container for the Pie Chart */}
        <div className="w-full lg:w-1/2 px-4">
          <div className="bg-white p-5 shadow-lg rounded-lg">
            <h3 className="text-lg font-semibold">Cost Distribution</h3>
            <Pie data={chartData.costData} options={pieChartOptions} />
          </div>
        </div>
      </div>
      <div className="w-full px-4 mt-8">
          <div className="bg-white p-5 shadow-lg rounded-lg">
            <h3 className="text-lg font-semibold text-center">Financial Overview and Strategic Analysis</h3>
            <div className="flex">
              <IncomeStatementSummaryWidget symbol={symbol} />
            </div>
          </div>
        </div>
        
      {/* Render IncomeStatementTable here */}
      <div className="w-full px-4 mt-8">
        <div className="bg-white p-5 shadow-lg rounded-lg text-center" style={{ maxHeight: '500px', overflowY: 'scroll' }}>
          <h3 className="text-lg font-semibold py-4">Income Statement</h3>
          <div className="flex justify-center">
            <IncomeStatementTable symbol={symbol} />
          </div>
        </div>
      </div>
    </div>
  </div>
);




};

export default IncStatePage;