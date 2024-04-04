import React, { createContext, useContext, useState, useEffect } from 'react';

const TickerContext = createContext();

export const TickerProvider = ({ children }) => {
  const [currentTicker, setCurrentTicker] = useState(() => {
    // Attempt to get a stored ticker symbol from localStorage
    const savedTicker = localStorage.getItem('currentTicker');
    return savedTicker || '';
  });

  useEffect(() => {
    // Store the currentTicker in localStorage whenever it changes
    localStorage.setItem('currentTicker', currentTicker);
  }, [currentTicker]);

  return (
    <TickerContext.Provider value={{ currentTicker, setCurrentTicker }}>
      {children}
    </TickerContext.Provider>
  );
};

export const useTicker = () => useContext(TickerContext);
