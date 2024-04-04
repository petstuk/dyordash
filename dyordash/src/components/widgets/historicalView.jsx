import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const HistoricalView = ({ symbol }) => {
    const [historicalData, setHistoricalData] = useState(null);
    const [recentClose, setRecentClose] = useState({ price: 0, change: 0 });
    const [selectedRange, setSelectedRange] = useState('1y'); // Default to 1 year
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistoricalData = async () => {
            try {
                setError(null); // Reset the error state before fetching new data
                const url = `http://127.0.0.1:8000/historical-data/${symbol}?range=${selectedRange}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('No historical data available');
                }
                const data = await response.json();
                setHistoricalData(data);

                if (data.length > 1) {
                    const startPrice = data[0].Close;
                    const endPrice = data[data.length - 1].Close;
                    const change = ((endPrice - startPrice) / Math.abs(startPrice)) * 100;

                    setRecentClose({
                        price: endPrice,
                        change: change
                    });
                }
            } catch (error) {
                setError(error.message);
            }
        };

        fetchHistoricalData();
    }, [symbol, selectedRange]);

    const formatNumber = (num) => num.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

  
     const getOptions = () => {
      // Determine if the selected range is long-term ('1y', '5y', 'max') or short-term ('5d', '1mo', '6mo')
      const isLongTerm = ['1y', '5y', 'max'].includes(selectedRange);
  
      return {
          plugins: {
              legend: {
                  display: false, // Hide legend explicitly
              },
          },
          scales: {
              x: {
                  type: 'time',
                  time: {
                      // Conditional formatting based on the selected range
                      unit: isLongTerm ? 'month' : 'day', // Use 'month' for long-term, 'day' for short-term
                      tooltipFormat: isLongTerm ? 'MMM yyyy' : 'd MMM', // Adjust tooltip format accordingly
                      displayFormats: {
                          // Specify formats for 'day' and 'month' units
                          day: 'd MMM',
                          month: 'MMM yyyy',
                      },
                  },
                  ticks: {
                      autoSkip: true,
                      maxTicksLimit: isLongTerm ? 4 : 10, // Allow more ticks for longer ranges
                  },
              },
              y: {
                  ticks: {
                      // Adjust the y-axis ticks as needed
                      beginAtZero: false,
                      maxTicksLimit: 8,
                  },
              },
          },
          interaction: {
              mode: 'index',
              intersect: false,
          },
          elements: {
              point: {
                  radius: 0, // No point radius for a cleaner look
              },
          },
          tooltips: {
              intersect: false,
              mode: 'index',
              callbacks: {
                  label: function(context) {
                      const label = context.dataset.label || '';
                      const value = context.parsed.y;
                      return `${label}: $${value.toFixed(2)}`;
                  },
                  title: function(context) {
                      if (context.length > 0) {
                          const date = context[0].label;
                          return date;
                      }
                      return '';
                  },
              },
          },
      };
  };
  

  if (error) {
    return (
        <div className="max-w-4xl mx-auto p-5 bg-white shadow-lg rounded-lg" style={{ height: '100%' }}>
        <h2 className="text-xl font-bold mb-4">Historical View for {symbol.toUpperCase()}</h2>
        <div className="text-gray-700 text-sm flex justify-center items-center h-full py-20">
            {error}
        </div>
      </div>
    );
  }

  const chartData = historicalData ? {
    labels: historicalData.map(item => item.Date),
    datasets: [{
      label: 'Close Price',
      data: historicalData.map(item => item.Close),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    }]
  } : null;

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">Historical View for {symbol.toUpperCase()}
        {historicalData && (
          <span className="ml-4 text-base font-normal">
            {formatNumber(recentClose.price)} {/* Updated to use formatNumber without currency symbol */}
            <span className='px-2' style={{ color: recentClose.change >= 0 ? 'green' : 'red' }}>
              ({recentClose.change >= 0 ? '+' : ''}{formatNumber(recentClose.change)}%)
            </span>
          </span>
        )}
      </h2>
      {chartData && <Line data={chartData} options={getOptions()} />}
      <div className="flex justify-center space-x-2 mt-4">
        {['5d', '1mo', '6mo', '1y', '5y', 'max'].map(range => (
          <button
            key={range}
            className={`py-1 px-3 text-sm text-white rounded bg-[rgb(75,192,192)] hover:bg-[rgb(57,146,146)] ${selectedRange === range ? 'bg-[rgb(57,146,146)]' : ''}`}
            onClick={() => setSelectedRange(range)}>
            {range.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoricalView;