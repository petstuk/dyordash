import React, { useState, useEffect } from 'react';
import TrendingTickers from '../widgets/trendingTickers';
import MostActiveStocks from '../widgets/mostActive';
import TopCrypto from '../widgets/topCrypto';
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import TopGainers from '../widgets/TopGainers'
import TopLosers from '../widgets/TopLosers'


const ColumnRotator = ({ columns }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const columnCount = columns.length;
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((currentIndex + 1) % columnCount);
      }, 30000); // Change column every 30 seconds
  
      return () => clearInterval(interval);
    }, [currentIndex, columnCount]);
  
    const nextColumn = () => {
      setCurrentIndex((currentIndex + 1) % columnCount);
    };
  
    const prevColumn = () => {
      setCurrentIndex((currentIndex - 1 + columnCount) % columnCount);
    };
  
    const rotatedColumns = [
      columns[currentIndex % columnCount],
      columns[(currentIndex + 1) % columnCount],
      columns[(currentIndex + 2) % columnCount]
    ];
  
    const columnWidth = `${100 / rotatedColumns.length}%`; // Calculate width dynamically

    const translateXValue = -(currentIndex * 100 / 3);
  
    return (
      <div className="bg-gray-100 p-4 shadow rounded-lg flex items-center justify-center">
        <HiChevronDoubleLeft onClick={prevColumn} className="mr-4 cursor-pointer" size={24} />
        <div className="flex-1">
          <div className="flex">
            {rotatedColumns.map((column, index) => (
              <div key={index} style={{ width: columnWidth }}>
                {column}
              </div>
            ))}
          </div>
        </div>
        <HiChevronDoubleRight onClick={nextColumn} className="ml-2 cursor-pointer" size={24} />
      </div>
    );
  };
  

// Usage example
const ColumnRotatorApp = () => {
  const columns = [
    <div className="space-y-8"><h1>Our Top 5 Cryptos</h1><TopCrypto /></div>,
    <div className="space-y-8"><h1>Our Trending Tickers</h1><TrendingTickers /></div>,
    <div className="space-y-8"><h1>Most Active Tickers</h1><MostActiveStocks /></div>,
    <div className="text-black space-y-8">Today's <span className="text-green-500 font-bold">Gainers</span><TopGainers /></div>,
    <div className="text-black space-y-8">Today's <span className="text-red-500 font-bold">Losers</span><TopLosers /></div>,
    // Add more columns as needed
  ];

  return (
    <div className="App">
      <ColumnRotator columns={columns} />
    </div>
  );
};

export default ColumnRotatorApp;
