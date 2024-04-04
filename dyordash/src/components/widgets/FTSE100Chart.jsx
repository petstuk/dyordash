import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js/auto'; // Import from chart.js/auto
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

// Register the chart components
ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const FTSE100Chart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'FTSE 100 Close Prices',
      data: [],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    }]
  });

  const chartOptions = {
    plugins: {
      legend: {
        display: false // Explicitly hide the legend
      },
    },
    scales: {
      x: {
        type: 'time', // Use time scale for x-axis
        time: {
          tooltipFormat: 'MMM d, yyyy', // Updated format for tooltip display
          displayFormats: {
            day: 'MMM d, yyyy', // Updated format for x-axis display
          },
        },
        ticks: {
          maxTicksLimit: 5, // Maximum number of ticks to display on the x-axis
        },
      },
      y: { // Add y-axis configuration
        ticks: {
          maxTicksLimit: 5, // Maximum number of ticks to display on the y-axis
        },
      },
    },
    interaction: {
      mode: 'index', // Set the interaction mode to index
      intersect: false, // Don't intersect points on hover
    },
    elements: {
      point: {
        radius: 0, // Hide points by default
      },
    },
    tooltips: {
      intersect: false, // Don't intersect tooltips
      callbacks: {
        label: function(context) {
          const label = context.raw;
          const date = new Date(context.parsed.x);
          return `${date.toDateString()}: $${label}`;
        },
      },
    },
  };
  
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/ftse100-data/');
        const rawData = await response.json();
  
        if (Array.isArray(rawData) && rawData.length > 0) {
          const labels = rawData.map(item => new Date(item.Date)); // Convert dates to Date objects
  
          const data = rawData.map(item => ({ x: new Date(item.Date), y: item.Close })); // Use { x, y } format
  
          setChartData({
            labels: labels,
            datasets: [{
              ...chartData.datasets[0],
              data: data
            }]
          });
        } else {
          console.error("Fetched data is empty or invalid.");
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
    
    return () => {
      // Destroy the chart instance to prevent canvas reuse error
      ChartJS.getChart('2')?.destroy();
    };
  }, []);

  return (
    <div>
      {chartData.datasets[0].data.length > 0 ? <Line options={chartOptions} data={chartData} /> : <p>Loading chart data...</p>}
    </div>
  );
};

export default FTSE100Chart;
