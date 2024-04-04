import React, { useEffect, useState } from 'react';
import { useTicker } from './TickerContext'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';
import NoTickerSearched from '../effects/noTickerSearched'; // Ensure this path is correct

const ProtectedRoute = ({ children }) => {
  const { currentTicker } = useTicker();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!currentTicker) {
      setIsModalOpen(true); // Show the NoTickerSearched modal if no ticker is present
    }
  }, [currentTicker]);

  const handleClose = () => {
    setIsModalOpen(false);
    navigate("/"); // Always navigate back to the root page on close
  };

  return (
    <>
      <NoTickerSearched
        isOpen={isModalOpen}
        title="No Ticker Entered"
        message="Please enter a ticker symbol to access this page."
        onClose={handleClose}
      />
      {currentTicker ? children : null}
    </>
  );
};

export default ProtectedRoute;
