import React, { useEffect } from 'react';
import { BiSolidNoEntry } from "react-icons/bi"; // Ensure this import is correct

const NoTickerSearched = ({ isOpen, title, message, onClose }) => {
  // Effect for adding and removing event listeners
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Close modal on Space (keyCode 32) or Esc (keyCode 27)
      if (event.keyCode === 32 || event.keyCode === 27) {
        onClose();
      }
    };

    // Add event listener when the component mounts
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    // Cleanup function to remove event listener when the component unmounts or isOpen changes
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]); // Depend on isOpen and onClose to re-bind the event listener correctly

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        padding: 20,
        background: '#fff',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        lineHeight: '1.5',
      }}>
        <BiSolidNoEntry style={{ color: 'rgb(75, 192, 192)', fontSize: '48px', marginBottom: '20px' }} />
        <h2 style={{ marginBottom: '20px', lineHeight: '1.3' }} className='font-bold'>{title}</h2>
        <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>{message}</p>
        <button onClick={onClose} style={{
          marginTop: '10px',
        }}>Go Back</button>
      </div>
    </div>
  );
};

export default NoTickerSearched;
